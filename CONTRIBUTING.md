# CONTRIBUTING

#### At Monkeys, contributions are always welcome, no matter how large or small.

## Communication Style (Recommended)

1. Always include screenshots for visual changes.
2. Provide a detailed description in your Pull Request (PR) and follow give format.
3. Review your code thoroughly, leaving comments where necessary for reviewers.
4. Maintain active communication in issues and PRs to facilitate collaboration.

## Setup

1. Clone & create this repo locally with the following command:

```sh
git clone https://github.com/the-monkeys/the_monkeys.git
```

2. Install dependencies using npm:

```sh
npm install
# or npm install --force
```

3. Copy `.env.example` to `.env.local` and update the variables.

```
cp .env.example .env.local
```

4. Input all the required enviroment variables in .env file.

5. Start the development server:

```sh
# At the root of the repo
npm run dev
```

## Quick Setup using Docker

1. Clone & create this repo locally with the following command:

```sh
git clone https://github.com/the-monkeys/the_monkeys.git
```

2. Run this Docker command

```sh
docker build -t monkeys .
```

```sh
docker run   -e NEXT_PUBLIC_API_URL=https://dev.themonkeys.site/api/v1   -e AUTH_SECRET=mysecpassword   -e NEXTAUTH_URL=http://localhost:3000   -e NEXTAUTH_SECRET=mysecpassword -p 3000:3000 monkeys
```

## Pull Requests

### _We actively welcome your pull requests, however linking your work to an existing issue is preferred._

1. Fork the repo and create your branch
2. Name your branch something that is descriptive to the work you are doing. i.e. adds-new-thing.
3. Make sure you address any lint warnings.
4. If you make the existing code better, please let us know in your PR description.
5. A PR description and title are required.

### Work in progress

GitHub has support for draft pull requests, which will disable the merge button until the PR is marked as ready for merge.

## Issues

If you plan to contribute a change based on an open issue, please assign yourself by commenting on the following word `.take`. Issues that are not assigned are assumed open, and to avoid conflicts, please assign yourself before beginning work on any issues.

If you would like to contribute to the project for the first time, please consider joining checking the [good first issue](https://github.com/the-monkeys/the_monkeys/issues?q=is%3Aopen+is%3Aissue+label%3A%22%F0%9F%99%8B%E2%80%8D%E2%99%82%EF%B8%8F+good+first+issue%22) labels.

Also, all questions are welcomed.

```

```
