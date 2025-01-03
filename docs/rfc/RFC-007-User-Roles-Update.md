# RFC-007: User Roles Update

## Status
Superseded by CONVERSATION-010: The role-based system has been removed in favor of a more flexible approach where all users can act as both clients and professionals based on their profile and calendar settings.

## Summary
This RFC originally described the implementation of a flexible user roles system that allowed users to have multiple roles simultaneously. However, this approach was later found to be unnecessarily complex, and the system was simplified to remove explicit roles entirely.

## Context and Problem Statement
The initial design restricted users to a single role (either CLIENT or PROFESSIONAL). We then moved to a multiple-role system, but ultimately decided that no explicit roles were needed as the platform's functionality is better served by a profile-based approach where any user can both offer and seek services.

## Decision
**Updated Decision**: Remove the role-based system entirely. User capabilities are now determined by:
- Profile completion status
- Calendar availability
- Booking relationships

This change simplifies the system and provides more natural flexibility for users to participate in both sides of the platform.

## Technical Details

### Database Changes
**Updated**: Removed Role enum and UserRole model entirely. The User model now connects directly to profiles and bookings without role-based restrictions.

### API Changes
- Simplified registration endpoint (no role assignment)
- Updated authentication responses to remove role information
- JWT improvements remain:
  - Added `jti` (JWT ID) claim for unique tokens
  - Maintained 15-minute expiry for access tokens
  - Maintained 7-day expiry for refresh tokens

### Frontend Changes
- Removed role selection from registration form
- Updated user interface to remove role-based elements
- Modified authentication state management to remove role handling

## Security Considerations
- All existing security measures remain in place
- Access control is now based on profile completion and calendar availability
- JWT tokens include unique identifiers to prevent token reuse

## Testing
- Updated E2E tests to remove role-related tests
- Added tests for profile-based access control
- Verified booking functionality works without roles

## Consequences
### Positive
- Simpler, more intuitive user experience
- No artificial restrictions on user capabilities
- Reduced complexity in codebase
- Better alignment with real-world use cases

### Negative
- Need to update existing documentation
- Migration required for existing systems

## Implementation
The original role-based implementation has been replaced with a simpler, profile-based system. See [CONVERSATION-010](../conversations/CONVERSATION-010-Remove-Role-System.md) for details of the new implementation.

## References
- [CONVERSATION-010: Remove Role System](../conversations/CONVERSATION-010-Remove-Role-System.md)
- [RFC-010: User Profiles](RFC-010-User-Profiles.md)
- [PRD: User Requirements & Personas](../PRD.md) 