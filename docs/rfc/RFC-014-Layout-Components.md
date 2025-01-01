# RFC-014: Layout Components

## Status
- [x] Proposed
- [ ] Accepted
- [ ] Implemented
- [ ] Tested

## Summary
This RFC proposes the implementation of core layout components (Header and Footer) that will be used across the platform to provide consistent navigation and branding.

## Background
Before implementing specific pages like profiles, we need a consistent layout structure. The header will provide navigation and user-related actions, while the footer will contain important links and information.

## Detailed Design

### Header Component
- Logo/Brand
- Main Navigation
  - Home
  - Browse Professionals
  - About
  - Contact
- User Section (when authenticated)
  - Profile dropdown
    - View Profile
    - Settings
    - Switch Role (Client/Professional)
    - Logout
  - Notifications (future)
  - Messages (future)
- Auth Section (when not authenticated)
  - Login
  - Register

### Footer Component
- Company Information
  - About Us
  - Contact
  - Terms of Service
  - Privacy Policy
- Resources
  - Help Center
  - Blog (future)
  - API Documentation
- Social Links
  - LinkedIn
  - Twitter
  - GitHub
- Newsletter Signup (future)

### Technical Implementation

#### Header
```typescript
// components/layout/header/Header.tsx
interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

// components/layout/header/UserMenu.tsx
interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

// components/layout/header/Navigation.tsx
interface NavigationProps {
  items: NavigationItem[];
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
}
```

#### Footer
```typescript
// components/layout/footer/Footer.tsx
interface FooterProps {
  showNewsletter?: boolean;
}

// components/layout/footer/NewsletterForm.tsx
interface NewsletterFormProps {
  onSubscribe: (email: string) => Promise<void>;
}
```

#### Layout
```typescript
// components/layout/Layout.tsx
interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}
```

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Collapsible footer sections on mobile
- Sticky header with scroll behavior
- Full-width on mobile, contained on desktop

### State Management
- User authentication state from Next-Auth
- Active route highlighting
- Mobile menu state
- User menu dropdown state

### Implementation Phases

#### Phase 1: Core Components
- [ ] Basic header structure
- [ ] Navigation component
- [ ] User menu dropdown
- [ ] Basic footer structure
- [ ] Responsive layout wrapper

#### Phase 2: Enhanced Features
- [ ] Animations and transitions
- [ ] Scroll behavior
- [ ] Mobile optimizations
- [ ] Newsletter integration
- [ ] Role switcher

#### Phase 3: Future Features
- [ ] Notifications
- [ ] Messages
- [ ] Theme switcher
- [ ] Language selector

### Testing Strategy
- Unit tests for components
- Integration tests for user interactions
- Responsive design tests
- Accessibility tests
- Performance tests

## Security Considerations
- XSS prevention in navigation items
- CSRF protection for forms
- Secure handling of user data
- Rate limiting for newsletter signup

## Accessibility
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Performance
- Code splitting
- Lazy loading of dropdown menus
- Image optimization for logos
- Minimal initial bundle size
- Efficient re-renders

## Timeline
- Phase 1: 2 days
- Phase 2: 2 days
- Phase 3: Based on feature priorities

## Open Questions
1. Should we implement language selection in Phase 1?
2. How should we handle deep navigation on mobile?
3. Should the header be different for client vs professional views?
4. How to handle newsletter subscriptions?

## References
- [RFC-006: Design System](./RFC-006-Design-System.md)
- [Next.js Layout Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Headless UI Components](https://headlessui.com/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [CONVERSATION-012: Layout Components Discussion](../conversations/CONVERSATION-012-Layout-Components-Discussion.md) 