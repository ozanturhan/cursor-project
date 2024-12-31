# RFC-010: User Profiles

## Status
- [x] Proposed
- [x] Accepted
- [x] Implemented (Backend)
- [x] Tested (Backend)
- [ ] Implemented (Frontend)
- [ ] Tested (Frontend)

## Summary
This RFC proposes the implementation of user profiles in the consultation platform, allowing users to manage their personal information, bio, social media links, and availability for consultations.

## Background
Users need a way to present themselves professionally and manage their availability for consultations. This includes both clients who want to share their background and professionals who need to showcase their expertise and manage their consultation schedule.

## Detailed Design

### Profile Information
- Basic Information
  - Name
  - Bio/Description
  - Profile Picture (future enhancement)
  - Professional Title
  - Location (optional)

- Social Media Links
  - X (Twitter)
  - LinkedIn
  - GitHub
  - Personal Website
  - Other platforms (extensible)

### Professional Availability
- Weekly Schedule
  - Available days
  - Time slots for each day
  - Timezone handling
  - Buffer time between consultations
  - Recurring availability patterns

### Database Schema Changes
```prisma
model Profile {
  id          String    @id @default(cuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio         String?   @db.Text
  title       String?
  location    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  socialLinks SocialLink[]
  availability Availability[]
}

model SocialLink {
  id        String   @id @default(cuid())
  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  platform  String   // e.g., "TWITTER", "LINKEDIN", "GITHUB"
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([profileId, platform])
}

model Availability {
  id        String   @id @default(cuid())
  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  dayOfWeek Int     // 0-6 for Sunday-Saturday
  startTime String  // Format: "HH:mm"
  endTime   String  // Format: "HH:mm"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([profileId, dayOfWeek])
}
```

### API Endpoints

#### Profile Management
- `GET /api/profile` - Get current user's profile
- `GET /api/profile/:userId` - Get public profile of a user
- `PUT /api/profile` - Update current user's profile
- `DELETE /api/profile` - Delete current user's profile

#### Social Links
- `POST /api/profile/social-links` - Add social link
- `PUT /api/profile/social-links/:id` - Update social link
- `DELETE /api/profile/social-links/:id` - Remove social link

#### Availability Management
- `POST /api/profile/availability` - Add availability slot
- `PUT /api/profile/availability/:id` - Update availability slot
- `DELETE /api/profile/availability/:id` - Remove availability slot
- `GET /api/profile/:userId/availability` - Get user's availability

### Frontend Routes
- `/profile` - Current user's profile management
- `/profile/edit` - Edit profile form
- `/profile/:userId` - Public profile view
- `/profile/availability` - Availability management for professionals

### Implementation Phases

#### Phase 1: Backend Implementation ✅
- [x] Database schema setup
- [x] Profile service implementation
- [x] API endpoints
- [x] Unit tests
- [x] E2E tests
- [x] Integration with auth system

#### Phase 2: Frontend Implementation (Not Started)
- [ ] Profile management page
- [ ] Profile editing form
- [ ] Social links management
- [ ] Availability calendar
- [ ] Public profile view

#### Phase 3: Enhanced Features (Planned)
- [ ] Profile picture upload
- [ ] Rich text editor for bio
- [ ] Calendar integration
- [ ] Profile visibility settings

### Security Considerations
- Profile visibility controls
- Input sanitization
- Rate limiting for profile updates
- Authorization checks for private information

### Testing Strategy
- Unit tests for profile service methods
- Integration tests for API endpoints
- E2E tests for profile management flow
- Validation testing for social links
- Timezone handling tests

## Alternatives Considered
1. Using a single table for all profile data
2. Storing availability as JSON
3. Using a third-party scheduling service

## Timeline
- Phase 1: 1 week
- Phase 2: 1 week
- Phase 3: 2 weeks

## Open Questions
1. Should we support custom social platform types?
2. How should we handle timezone conversions?
3. Should we implement profile verification?
4. How to handle profile picture storage?

## References
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Date-fns Timezone](https://date-fns.org/docs/Time-Zones) 