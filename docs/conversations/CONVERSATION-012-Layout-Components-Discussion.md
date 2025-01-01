# CONVERSATION-012: Layout Components Discussion

## Date
2024-01-03

## Participants
- Development Team

## Context
Before implementing the profile pages, it was identified that we need basic layout components (header and footer) to provide consistent navigation and structure across the platform.

## Key Decisions
1. Create header and footer components before profile pages
2. Header should include:
   - Navigation menu
   - User profile dropdown
   - Role switcher
   - Authentication actions
3. Footer should include:
   - Company information
   - Resources
   - Social links
4. Use mobile-first approach for responsive design
5. Integrate with Next-Auth for user state
6. Follow accessibility guidelines

## Code Examples
### Layout Structure
```typescript
// Basic layout structure
<Layout>
  <Header user={session?.user} />
  <main>{children}</main>
  <Footer />
</Layout>

// User menu in header
<UserMenu
  user={user}
  onLogout={handleLogout}
  onRoleSwitch={handleRoleSwitch}
/>
```

## Follow-up Actions
1. Implement layout components (RFC-014)
   - Create header component
   - Create footer component
   - Add responsive styles
2. Continue with profile pages implementation (RFC-010)
   - Use new layout components
   - Implement profile management
   - Add availability calendar

## References
- [RFC-014: Layout Components](../rfc/RFC-014-Layout-Components.md)
- [RFC-006: Design System](../rfc/RFC-006-Design-System.md)
- [RFC-010: User Profiles](../rfc/RFC-010-User-Profiles.md)

## Notes
- Consider implementing language selection in future phases
- Need to handle deep navigation on mobile devices
- Consider different header views for client vs professional roles 