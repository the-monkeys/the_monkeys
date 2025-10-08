# -------- Base Stage: Install Node & pnpm --------
FROM node:18-slim AS base
WORKDIR /the_monkeys

# Enable pnpm (safer than installing via npm)
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

# Copy everything (use .dockerignore to exclude large or unnecessary stuff)
COPY . .

# -------- Dependencies Stage --------
FROM base AS deps

# Install all dependencies using pnpm and keep versions locked
RUN npm run install-deps 

# -------- Build Stage --------
FROM deps AS build

# Run turbo build across the monorepo

RUN pnpm run build
# -------- Runtime Stage --------
FROM node:18-alpine AS runner
WORKDIR /the_monkeys

# Enable pnpm again (optional unless runtime needs it)
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

# Copy only what's needed for runtime

# node_modules (entire monorepo's installed deps)
COPY --from=deps /the_monkeys/node_modules ./node_modules

# built apps and packages — assuming each package builds into its own dist
COPY --from=build /the_monkeys/packages ./packages
COPY --from=build /the_monkeys/the_monkeys ./the_monkeys

# Minimal config files (some may be needed at runtime)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Default command — adjust based on your app
# Example: Node.js backend entry point
CMD ["node", "the_monkeys/dist/index.js"]
