# RFC-007: User Roles Update

## Status
Implemented

## Summary
This RFC describes the implementation of a flexible user roles system that allows users to have multiple roles simultaneously. This change enables users to act as both clients and professionals within the platform.

## Context and Problem Statement
The initial design restricted users to a single role (either CLIENT or PROFESSIONAL). However, we recognized that users might want to both offer and seek services on the platform. This limitation does not reflect real-world use cases where a user might want to both provide and receive consultations.

## Decision
Implement a flexible role system that allows users to have multiple roles simultaneously, starting with CLIENT role by default and allowing the addition of the PROFESSIONAL role when needed.

## Technical Details

### Database Changes
- Removed `userType` field from User model
- Added new `UserRole` model with fields:
  - `id`: UUID
  - `userId`: UUID (Foreign Key)
  - `role`: Enum (CLIENT, PROFESSIONAL)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### API Changes
- Modified registration endpoint to automatically assign CLIENT role
- Updated authentication responses to include user roles
- Added JWT improvements:
  - Added `jti` (JWT ID) claim for unique tokens
  - Maintained 15-minute expiry for access tokens
  - Maintained 7-day expiry for refresh tokens

### Frontend Changes
- Removed role selection from registration form
- Updated user interface to handle multiple roles
- Modified authentication state management to support multiple roles

## Security Considerations
- All existing security measures remain in place
- Role-based access control (RBAC) is maintained
- JWT tokens include unique identifiers to prevent token reuse

## Testing
- Updated E2E tests to verify role assignment
- Added tests for token refresh functionality
- Verified role-based access control

## Consequences
### Positive
- Users have more flexibility in how they use the platform
- Simplified registration process by removing role selection
- Improved token security with unique identifiers
- Better alignment with real-world use cases

### Negative
- Slightly more complex role management
- Need to update existing role-based access control logic

## Implementation
The changes have been implemented and tested, including:
- Database schema updates
- API endpoint modifications
- Frontend component updates
- E2E test coverage

## References
- Related to RFC-002-Authentication
- Related to RFC-003-NextAuth-Integration
- [CONVERSATION-009: User Roles Update](../conversations/CONVERSATION-009-User-Roles-Update.md) 