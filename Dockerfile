# Minimal Docker build for Monkeys
FROM node:18-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Builder stage
FROM base AS builder
RUN corepack enable pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/the_monkeys/package.json ./apps/the_monkeys/
COPY packages/ui/package.json ./packages/ui/  
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
# Declare build-time args so ENV can reference them without error
ARG NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY
ARG NEXT_PUBLIC_GROWTHBOOK_API_HOST
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
ENV NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY=$NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY
ENV NEXT_PUBLIC_GROWTHBOOK_API_HOST=$NEXT_PUBLIC_GROWTHBOOK_API_HOST
RUN pnpm build

# Runtime stage
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app
COPY --from=builder --chown=nextjs:nodejs /app/apps/the_monkeys/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/the_monkeys/.next/static ./apps/the_monkeys/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/the_monkeys/public ./apps/the_monkeys/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/the_monkeys/server.js"]