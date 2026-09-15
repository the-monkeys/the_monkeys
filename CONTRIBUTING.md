# Contributing to Monkeys

Thank you for your interest in contributing to Monkeys! We welcome bug fixes, documentation improvements, UI enhancements, and new features.

This guide provides the necessary steps to set up the repository locally, understand the architecture, and submit changes.

---

## 🏛️ Project Architecture

Monkeys is organized as a **Turborepo monorepo** managed with **pnpm**:

* **`apps/the_monkeys`**: The primary web application built with [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [TanStack Query](https://tanstack.com/query).
* **`packages/ui`**: Shared UI component library (`@the-monkeys/ui`) composed of Radix UI primitives and Tailwind CSS styles.
* **`packages/config`**: Shared configuration packages across the workspace.

### Backend

The Monkeys backend is written in Go and hosted in a separate repository:
* **Repository**: [Monkeys Engine](https://github.com/the-monkeys/monkeys_engine)

You do not need to run the backend locally for most frontend work. The frontend connects to the backend over HTTP REST and WebSockets using the endpoints defined in your environment file.

---

## 📋 Prerequisites

Ensure you have the following installed before starting:

| Tool | Recommended Version | Purpose |
| :--- | :--- | :--- |
| [Git](https://git-scm.com/) | Recent version | Version control |
| [Node.js](https://nodejs.org/) | `>= 18.17.0` (see [`.nvmrc`](./.nvmrc)) | JavaScript runtime |
| [pnpm](https://pnpm.io/) | `>= 10.0.0` (specified in [`package.json`](./package.json)) | Workspace package manager |

> [!TIP]
> If `pnpm` is not installed globally on your system, you can bootstrap it from the repository root:
> ```bash
> npm run install-deps
> ```

---

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/the-monkeys/the_monkeys.git
cd the_monkeys
```

### 2. Install Dependencies

Install all dependencies across the monorepo workspaces:

```bash
pnpm install
```

### 3. Configure Environment Variables

1. Copy the example configuration to `.env.local` inside `apps/the_monkeys`:

```bash
cp apps/the_monkeys/.env.example apps/the_monkeys/.env.local
```

2. Review the variables in `apps/the_monkeys/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://local.monkeys.com.co:8080/api/v1
NEXT_PUBLIC_API_URL_V2=http://local.monkeys.com.co:8080/api/v2
NEXT_PUBLIC_WSS_URL=ws://local.monkeys.com.co:8080/ws
NEXT_PUBLIC_LIVE_URL=http://localhost:3000
AUTH_SECRET=your_development_secret
```

> [!NOTE]
> Client components read configuration via [`next-runtime-env`](https://www.npmjs.com/package/next-runtime-env) (`PublicEnvScript` in `layout.tsx`), which allows configuration to be supplied dynamically at runtime.

### 4. Configure Local Host Mapping (Optional)

To allow authentication cookies to be shared properly between the frontend and a local backend instance across subdomains, map `local.monkeys.com.co`:

```bash
make setup-hosts
```

* Alternatively on Linux/macOS:
  ```bash
  sudo bash ./scripts/setup-hosts.sh
  ```
* On Windows (PowerShell as Administrator):
  ```powershell
  powershell -ExecutionPolicy Bypass -File "scripts/setup-hosts.ps1"
  ```

### 5. Start the Development Server

Start Turborepo in development mode:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://local.monkeys.com.co:3000`) in your browser.

---

## ⌨️ Common Commands

Run these commands from the repository root. Turborepo coordinates execution across `apps/` and `packages/`:

| Command | What it does |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server with Turborepo hot-reloading |
| `pnpm build` | Runs lint checks and produces production builds across all workspaces |
| `pnpm test` | Runs the full Vitest unit and component test suite |
| `pnpm lint` | Runs Next.js ESLint and Biome checks across apps and packages |
| `pnpm format` | Formats the codebase using Prettier and Biome |

To target a specific workspace directly:

```bash
# Run tests only in apps/the_monkeys
pnpm --filter the_monkeys test

# Run lint only in packages/ui
pnpm --filter @the-monkeys/ui lint
```

---

## 🔀 Contribution Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. **Make your changes**: Ensure code follows existing TypeScript conventions and styling patterns.
3. **Run checks locally**:
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```
4. **Commit using descriptive messages**:
   ```bash
   git commit -m "feat(studio): add responsive scaling for story templates"
   ```
5. **Open a Pull Request**: Provide a clear description of the problem solved, any visual or behavioral changes, and manual testing steps.

---

## ❓ Need Help?

If you find a bug, encounter unclear documentation, or have a feature proposal:
* Open an issue on GitHub: [Issues](https://github.com/the-monkeys/the_monkeys/issues)
* Review backend details at: [Monkeys Engine](https://github.com/the-monkeys/monkeys_engine)
