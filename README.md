# Turborepo starter

This is an official starter Turborepo.

## Prerequisites

### Node.js Version Requirements

This project requires Node.js version 20.18.1 or higher. We use `.nvmrc` at the root level to maintain a consistent Node.js version across all packages and apps.

To set up the correct Node.js version:

1. Install [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
2. Run the following commands from the project root:
   ```sh
   nvm install    # Installs the Node.js version specified in .nvmrc
   nvm use       # Switches to the specified Node.js version
   ```

### Yarn Version Requirements

This project uses Yarn 4.6.0 as the package manager. We use Corepack to ensure a consistent Yarn version.

To set up Yarn:

1. Enable Corepack (included with Node.js):
   ```sh
   corepack enable
   ```

2. Yarn will be automatically installed at the correct version (4.6.0) when you run any yarn command.

## Development

To develop all apps and packages:

```sh
yarn install     # Install dependencies
yarn dev         # Start development servers
```

## Testing

### Unit Tests
```sh
yarn test        # Run all unit tests
```

### End-to-End Tests
```sh
cd apps/backend
./scripts/test-e2e.sh  # Run e2e tests in Docker
```

Note: E2E tests require Docker to be installed and running.

## What's inside?

This Turborepo includes the following packages/apps:

### Node.js Version Requirements

This project requires Node.js version 20.18.1 or higher. We use `.nvmrc` at the root level to maintain a consistent Node.js version across all packages and apps.

To set up the correct Node.js version:

1. Install [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
2. Run the following commands from the project root:
   ```sh
   nvm install    # Installs the Node.js version specified in .nvmrc
   nvm use       # Switches to the specified Node.js version
   ```

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
