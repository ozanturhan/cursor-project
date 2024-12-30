# Development Workflow & Rules

## Core Development Rules

### Documentation Rules
- Always check current RFC before modifications
- Keep PROGRESS_TRACKER.md current
- Document architectural decisions
- Add API documentation for new endpoints
- Update RFC if implementation deviates

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

### Branch Management
- Feature branches from main
- Follow conventional commits
- Require PR reviews
- Squash merge to main
- Keep branches up to date

## Change Management Process

### Before Making Changes
1. **RFC Validation**
   - Check current RFC specifications
   - Ensure changes align with RFC
   - Identify potential deviations

2. **Progress Tracking**
   - Verify current phase in tracker
   - Confirm task is in current phase
   - Check for dependencies

3. **Technical Review**
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