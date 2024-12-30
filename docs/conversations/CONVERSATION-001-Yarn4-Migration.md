# Conversation: Yarn 4 Migration

## Date
December 30, 2024

## Participants
- Development Team

## Context
The project was initially using Yarn 1, but we needed to upgrade to Yarn 4.6.0 to take advantage of modern features and better monorepo support. This migration was necessary to improve dependency management, workspace handling, and ensure better compatibility with our Docker-based e2e testing environment.

## Key Decisions

1. **Yarn Version Selection**
   - Chose Yarn 4.6.0 as the package manager
   - Decided to use Corepack for version management
   - Configured nodeLinker to use node-modules mode initially

2. **Configuration Approach**
   - Created `.yarnrc.yml` with specific settings:
     ```yaml
     nodeLinker: node-modules
     enableGlobalCache: true
     yarnPath: .yarn/releases/yarn-4.6.0.cjs
     packageExtensions:
       'ts-jest@*':
         peerDependencies:
           '@types/jest': '*'
     compressionLevel: mixed
     enableTelemetry: false
     ```
   - Updated `.gitignore` for Yarn 4 specific patterns

3. **Docker Integration**
   - Modified Dockerfile.test to support Yarn 4
   - Added Corepack enablement in Docker environment
   - Updated build and test scripts

## Code Examples

### Docker Configuration
```dockerfile
# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy package files
COPY package.json yarn.lock turbo.json .yarnrc.yml ./
COPY .yarn ./.yarn
```

### Jest Configuration Update
```javascript
module.exports = {
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};
```

## Follow-up Actions
1. Monitor for any issues with the new Yarn setup
2. Consider enabling Plug'n'Play mode in the future
3. Review and update CI/CD pipelines
4. Consider adding workspace-tools plugin

## References
- [Yarn 4 Documentation](https://yarnpkg.com/getting-started)
- [Corepack Documentation](https://nodejs.org/api/corepack.html)
- Related Commits:
  - "chore: update to Yarn 4.6.0 and fix e2e test Docker setup"
  - "chore: complete Yarn 4.6.0 migration"

## Notes
- Successfully migrated all workspaces to Yarn 4
- Fixed e2e test environment in Docker
- Updated documentation to reflect new setup requirements
- All tests passing after migration 