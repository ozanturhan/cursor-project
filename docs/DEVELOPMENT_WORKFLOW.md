# Development Workflow & Rules

## Core Development Rules

### Documentation Rules
- Always check current RFC before modifications
- Review relevant chat histories in docs/chat_history before starting work
- Keep PROGRESS_TRACKER.md current
- Document architectural decisions
- Add API documentation for new endpoints
- Update RFC if implementation deviates
- Maintain conversation records for significant decisions
  - Create new record for important technical discussions
  - Follow the format in docs/conversations/README.md
  - Link conversation records to relevant RFCs and PRs
  - Update records if decisions change

### Chat History Guidelines
- Check docs/chat_history before starting new work
- Review relevant chat files for context
- Maintain chronological order of discussions
- Preserve exact chat messages for reference
- Use chat histories to:
  - Understand previous decisions
  - Continue interrupted work
  - Track implementation progress
  - Reference past solutions

### Code Style Rules
- Use TypeScript strict mode
- Follow ESLint configurations
- Maintain consistent file structure
- Add JSDoc comments for public APIs
- Follow naming conventions

### Testing Rules
- Unit tests required for business logic
- Integration tests for API endpoints
- E2E tests for critical flows
- Maintain test coverage above 80%
- Test documentation required

### Environment Rules
- Use .env.local for local development
- Never commit sensitive data
- Document all environment variables
- Use strong typing for configs
- Validate environment variables at startup

### Git Workflow & Commit Conventions

#### Branch Strategy
- Feature branches from main
- Follow conventional commits
- Require PR reviews
- Squash merge to main
- Keep branches up to date

#### Commit Message Format
```
type(scope): subject

[optional body]
[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `chore`: Build process or auxiliary tool changes
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `test`: Adding or modifying tests
- `perf`: Performance improvements
- `ci`: CI/CD related changes

Examples:
```
feat(auth): implement user authentication
docs(db): add database schema documentation
chore(deps): update dependencies
```

#### When to Commit
- After completing a logical unit of work
- After documentation updates
- After schema changes
- After adding new features
- After fixing bugs
- Before switching tasks

#### Commit Checklist
1. Update relevant documentation
2. Run linters and tests
3. Update PROGRESS_TRACKER.md if needed
4. Write clear commit message following conventions
5. Review changes before committing

## Change Management Process

### Before Making Changes
1. **RFC Validation**
   - Check current RFC specifications
   - Ensure changes align with RFC
   - Identify potential deviations

2. **Chat History Review**
   - Check docs/chat_history for relevant discussions
   - Review previous implementation details
   - Understand past decisions and context
   - Note any unfinished work or known issues

3. **Progress Tracking**
   - Verify current phase in tracker
   - Confirm task is in current phase
   - Check for dependencies

4. **Technical Review**
   - Review related documentation
   - Validate technical approach
   - Check for existing solutions

### During Implementation
1. **Code Quality**
   - Follow style guidelines
   - Write tests alongside code
   - Document public APIs
   - Use type-safe approaches

2. **Documentation**
   - Update technical docs
   - Add inline documentation
   - Document design decisions
   - Create/update conversation records
   - Link related documents and decisions

### After Making Changes
1. **Validation**
   - Run test suite
   - Verify documentation
   - Check for side effects

2. **Updates**
   - Update progress tracker
   - Document any deviations
   - Update related docs

3. **Review**
   - Self-review changes
   - Request peer review
   - Address feedback

## Current Status
- Active RFC: RFC-001 Core Platform MVP
- Current Phase: Phase 1A - Foundation
- Status: In Progress
- Next Milestone: Basic infrastructure setup 