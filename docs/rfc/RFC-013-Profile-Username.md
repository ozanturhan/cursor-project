# RFC-013: Profile Username

## Status
- [x] Proposed
- [ ] Accepted
- [ ] Implemented (Backend)
- [ ] Tested (Backend)
- [ ] Implemented (Frontend)
- [ ] Tested (Frontend)

## Summary
This RFC proposes adding a unique username/handle field to user profiles, allowing for more user-friendly profile URLs and easier profile discovery.

## Background
Currently, profile URLs use the user's UUID, which is not user-friendly or memorable (e.g., `/profile/1kwek2234kwrkwe`). This RFC proposes implementing a username system similar to Twitter or GitHub, where users can have custom profile URLs (e.g., `/profile/ozanturhan`).

## Detailed Design

### Database Schema Changes
```prisma
model Profile {
  id          String    @id @default(uuid())
  userId      String    @unique
  username    String    @unique // New field
  // ... existing fields ...

  @@index([username])
}
```

### Username Requirements
- Must be unique across the platform
- Length: 3-30 characters
- Allowed characters: a-z, 0-9, and underscore
- Case insensitive (stored as lowercase)
- Cannot be purely numeric
- Cannot start with underscore
- Reserved usernames list for system protection

### API Changes

#### New Endpoints
- `GET /api/profile/check-username/:username` - Check username availability
- `PUT /api/profile/username` - Update username (rate limited)

#### Modified Endpoints
- Change `GET /api/profile/:userId` to `GET /api/profile/:username`
- Update all profile-related endpoints to use username instead of userId where applicable

### Frontend Changes
- Add username field to profile creation/edit forms
- Add username availability checker with real-time feedback
- Update profile URLs to use username
- Add username validation on the client side

### Implementation Phases

#### Phase 1: Backend Changes
- [ ] Update Profile schema
- [ ] Create migration for existing profiles
- [ ] Implement username validation
- [ ] Add new endpoints
- [ ] Update existing endpoints
- [ ] Add rate limiting for username changes
- [ ] Add tests

#### Phase 2: Frontend Changes
- [ ] Update profile forms
- [ ] Add username availability checker
- [ ] Update profile URLs
- [ ] Add validation feedback
- [ ] Update tests

### Migration Strategy
1. Add nullable username field
2. Generate default usernames for existing profiles
3. Make username field required after migration
4. Update frontend to use new URLs

### Security Considerations
- Rate limit username changes (e.g., once per month)
- Prevent username squatting
- Reserve system usernames
- Case-insensitive uniqueness
- XSS prevention in username display
- Username length limits

### Reserved Usernames
- admin
- profile
- settings
- help
- support
- api
- system
- root
- administrator
- moderator
- staff
- team
- official
- security

## Alternatives Considered
1. Keep UUID-based URLs with optional vanity URLs
2. Use email usernames
3. Combine first and last name for URLs

## Timeline
- Backend Implementation: 2 days
- Frontend Updates: 2 days
- Testing and Migration: 1 day

## Open Questions
1. Should we allow username changes? If yes, how often?
2. How should we handle username conflicts during initial migration?
3. Should we implement username history tracking?
4. Should we allow unicode characters in usernames?

## References
- [GitHub Username Policy](https://docs.github.com/en/rest/users)
- [Twitter Username Requirements](https://help.twitter.com/en/managing-your-account/twitter-username-rules)
- [Prisma Unique Constraints](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#unique-fields) 