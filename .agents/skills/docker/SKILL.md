---
name: docker
description: >
  Docker containerization for .NET 10 applications. Covers multi-stage builds,
  .NET container images, non-root user configuration, health checks, and
  .dockerignore.
  Load this skill when containerizing an application with a Dockerfile,
  optimizing image size, setting up Docker Compose for local development, or
  when the user mentions "Docker", "Dockerfile", "container", "docker-compose",
  "image", "multi-stage", "non-root", ".dockerignore", or "container health
  check". For Dockerfile-less SDK publishing (`dotnet publish /t:PublishContainer`),
  load the container-publish skill instead.
---

# Docker

## Core Principles

1. **Multi-stage builds always** — Separate build and runtime stages. Build in the SDK image, run in the ASP.NET runtime image.
2. **Non-root by default** — .NET container images support `USER app` by default since .NET 8. Never run as root in production.
3. **Layer caching matters** — Copy `.csproj` files and restore before copying source code. This caches NuGet dependencies across builds.
4. **Health probes at the orchestrator level** — Expose a `/health/live` endpoint and let Kubernetes/Compose probe it. Chiseled and default aspnet images have no shell or curl, so in-image `HEALTHCHECK` commands have nothing to run with.

## Patterns

### Multi-Stage Dockerfile for Web API

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore (cached layer)
COPY ["src/MyApp.Api/MyApp.Api.csproj", "src/MyApp.Api/"]
COPY ["src/MyApp.Domain/MyApp.Domain.csproj", "src/MyApp.Domain/"]
COPY ["Directory.Build.props", "."]
COPY ["Directory.Packages.props", "."]
RUN dotnet restore "src/MyApp.Api/MyApp.Api.csproj"

# Copy everything and build
COPY . .
RUN dotnet publish "src/MyApp.Api/MyApp.Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Non-root user (default in .NET 8+ images)
USER app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "MyApp.Api.dll"]
```

### Container Health Probes

Prefer orchestrator-level probes (Kubernetes `livenessProbe`, Compose
`healthcheck`) over a Dockerfile `HEALTHCHECK` — the standard `aspnet` and
chiseled images ship no shell, no curl, and no wget, so there is nothing inside
the container to run the probe with. Point the orchestrator at `/health/live`:

```yaml
# docker-compose — probe from outside the app process
services:
  api:
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/health/live || exit 1"]
      interval: 30s
      timeout: 3s
      retries: 3
# Note: CMD-SHELL requires a shell + wget in the image. Use a non-chiseled
# variant for this, or better: let Kubernetes httpGet probes do it —
# they run from the kubelet, needing nothing inside the image.
```

If you must have an in-image HEALTHCHECK, base the runtime stage on a
non-chiseled image that includes `wget` — never re-run the app binary as the
probe command; that starts a second instance instead of checking the first.

### .dockerignore

```
**/.git
**/.vs
**/bin
**/obj
**/node_modules
**/Dockerfile*
**/docker-compose*
**/tests
```

### Docker Compose for Local Development

Key .NET-specific concerns — pass connection strings via environment, use `depends_on` with health checks:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: src/MyApp.Api/Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__Default=Host=postgres;Database=myapp;Username=postgres;Password=postgres
      - ConnectionStrings__Redis=redis:6379
    depends_on:
      postgres:
        condition: service_healthy
  # Add postgres/redis services with healthcheck — standard boilerplate
```

### Optimized Build with .slnx

For solutions with multiple projects, restore only the necessary projects.

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and all project files
COPY *.slnx .
COPY Directory.Build.props .
COPY Directory.Packages.props .
COPY src/**/*.csproj ./src/

# Restore project structure
RUN for file in src/**/*.csproj; do \
    mkdir -p $(dirname $file) && mv $file $(dirname $file)/; \
    done
RUN dotnet restore

COPY . .
RUN dotnet publish src/MyApp.Api -c Release -o /app/publish --no-restore
```

### Health Check Endpoint

```csharp
// In Program.cs — lightweight health endpoint for Docker
app.MapGet("/health/live", () => Results.Ok("healthy"))
    .ExcludeFromDescription();
```

## Anti-patterns

### Don't Use SDK Image for Runtime

```dockerfile
# BAD — SDK image is 900MB+, includes compilers
FROM mcr.microsoft.com/dotnet/sdk:10.0
COPY . .
RUN dotnet run

# GOOD — separate build and runtime, runtime image is ~200MB
FROM mcr.microsoft.com/dotnet/aspnet:10.0
```

### Don't Copy Everything Before Restore

```dockerfile
# BAD — any source change invalidates the NuGet cache
COPY . .
RUN dotnet restore

# GOOD — copy only project files first, then restore
COPY ["src/MyApp.Api/MyApp.Api.csproj", "src/MyApp.Api/"]
RUN dotnet restore "src/MyApp.Api/MyApp.Api.csproj"
COPY . .
```

### Don't Run as Root

```dockerfile
# BAD — running as root (security risk)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
COPY --from=build /app .
ENTRYPOINT ["dotnet", "MyApp.Api.dll"]

# GOOD — use the built-in non-root user
FROM mcr.microsoft.com/dotnet/aspnet:10.0
USER app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "MyApp.Api.dll"]
```

## Decision Guide

| Scenario | Recommendation |
|----------|---------------|
| Web API container | Multi-stage build with aspnet runtime image |
| Worker service | Multi-stage build with dotnet/runtime image |
| Local development | Docker Compose with service dependencies |
| CI builds | Multi-stage build (self-contained) |
| Image size optimization | Use Alpine variant + trimming for small images |
| Health monitoring | `/health` endpoint + orchestrator probe (K8s `httpGet` / Compose healthcheck) |
| Secrets | Environment variables or mounted secrets, never in image |
