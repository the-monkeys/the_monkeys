# Contributing to Monkeys

Thanks for your interest in contributing! This guide takes you from a fresh
clone to a running development server, and explains _why_ each step exists so
you are never guessing.

If anything here is unclear, that is a documentation bug worth reporting — open
an issue and we will fix it.

## What this repository is

This repository is the **frontend** of the Monkeys platform — the Next.js web
application that people see and interact with in the browser.

The **backend** lives in a separate repository,
[monkeys_engine](https://github.com/the-monkeys/monkeys_engine) (written in Go).
You do **not** need the backend to work on most frontend tasks; the app talks to
it over the network using the URLs you set in your environment file (see
[Environment setup](#environment-setup)).

## How the project is organized

Monkeys is a **monorepo** — several related packages living in one repository —
managed with [pnpm workspaces](https://pnpm.io/workspaces) and
[Turborepo](https://turbo.build/repo). In practice that means one `git clone`
and one install give you everything.

```
the_monkeys/
├─ apps/
│  └─ the_monkeys/     # The Next.js web application (what you run and see)
└─ packages/
   ├─ ui/              # Shared UI components used by the app (@the-monkeys/ui)
   └─ config/          # Shared configuration (@the-monkeys/config)
```

- **`apps/`** holds runnable applications. Today there is one: the web app.
- **`packages/`** holds shared code the app depends on, so common UI and config
  live in one place instead of being copy-pasted.

**Why pnpm?** It installs dependencies once and links them across the workspace,
which is fast and keeps package versions consistent between the app and the
shared packages.

**Why Turborepo?** A single command like `pnpm dev` runs the right task across
every workspace that needs it (and caches results), so you don't have to `cd`
into each folder and run things by hand.

## Prerequisites

Install these before you start:

| Tool                              | Version              | Why it's needed                                              |
| --------------------------------- | -------------------- | ------------------------------------------------------------ |
| [Git](https://git-scm.com/)       | any recent           | To clone the repository and manage your changes.             |
| [Node.js](https://nodejs.org/)    | **18.17.0 or later** | Runs the app and the tooling.                                |
| [pnpm](https://pnpm.io/)          | optional             | The package manager. `npm run install-deps` installs it for you. |

**Why Node.js 18.17.0 or later?** Next.js 14 (the framework this app is built
on) requires at least 18.17.0, and some tooling such as Vitest expects a modern
Node release. On an older version, install or startup will fail with confusing
errors. If you use [nvm](https://github.com/nvm-sh/nvm), the repo's `.nvmrc`
file pins a known-good version — run `nvm use` to match it.

## Local development

### 1. Clone the repository

```sh
git clone https://github.com/the-monkeys/the_monkeys.git
cd the_monkeys
```

### 2. Install dependencies

```sh
npm run install-deps
```

This installs pnpm (if you don't already have it) and then installs every
workspace's dependencies in one step. If you already have pnpm, you can simply
run:

```sh
pnpm install
```

### 3. Set up environment variables

The app reads configuration (such as the backend API URL) from a local
environment file that is **not** committed to Git, so each contributor provides
their own values.

1. Create a file named `.env.local` inside `apps/the_monkeys`.
2. Copy the variable names from `apps/the_monkeys/.env.example` into it, then
   fill in the values.

`.env.example` is the source of truth for which variables exist. For values you
don't have (for example, shared secrets), ask a maintainer.

### 4. Start the development server

```sh
npm run dev
# or
pnpm dev
```

The app runs directly at **[http://localhost:3000](http://localhost:3000)**.
Open that URL in your browser and you're ready to go.

> **No hosts-file configuration is required.** Earlier versions of this project
> asked you to map a custom domain in your system's hosts file. That is no
> longer needed — the server runs on `localhost:3000` out of the box.

## Common commands

Run these from the repository root; Turborepo forwards each one to the
workspaces that need it:

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Start the development server (with hot reload). |
| `pnpm build`        | Create a production build.                    |
| `pnpm test`         | Run the test suite (Vitest).                  |
| `pnpm lint`         | Check code for lint errors.                   |
| `pnpm format`       | Auto-format the code.                         |

## Submitting changes

1. Create a branch for your work.
2. Make your changes and commit them with a clear message.
3. Make sure `pnpm lint` and `pnpm test` pass locally.
4. Open a pull request describing what you changed and why.

Please follow the issue and pull request templates when raising an issue or PR —
it helps maintainers review your work faster.
