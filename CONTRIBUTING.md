# Contributing to Monkeys

Thanks for your interest in contributing! 

If anything here is unclear, that is a documentation bug worth reporting — open
an issue and we will fix it.

## What this repository is

This repository is the **frontend** of the Monkeys platform — the Next.js web
application that people see and interact with in the browser.

The **backend** is a separate Go repository,
[monkeys_brain](https://github.com/the-monkeys/monkeys_brain). You don't need it
for most frontend work — the app talks to it over the network using the URLs you
set in your environment file (see
[Set up environment variables](#3-set-up-environment-variables)).


## Prerequisites

Install these before you start:

| Tool                              | Version              | Why it's needed                                              |
| --------------------------------- | -------------------- | ------------------------------------------------------------ |
| [Git](https://git-scm.com/)       | any recent           | To clone the repository and manage your changes.             |
| [Node.js](https://nodejs.org/)    | **18.17.0 or later** | Runs the app and the tooling.                                |
| [pnpm](https://pnpm.io/)          | optional             | The package manager. `npm run install-deps` installs it for you. |

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

For `.env.example`, ask maintainer for details.

### 4. Start the development server

```sh
npm run dev
# or
pnpm dev
```

The app runs directly at **[http://localhost:3000](http://localhost:3000)**.
Open that URL in your browser and you're ready to go.

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

Please follow the issue and pull request templates when raising an issue or PR —
it helps maintainers review your work faster.
