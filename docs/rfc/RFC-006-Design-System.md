# RFC-006: Design System

## Status
- [x] Proposed
- [x] Accepted
- [ ] Implemented
- [ ] Tested

## Summary
This RFC outlines the design system and UI component architecture for the consultation platform.

## Background
A consistent design system is crucial for maintaining a cohesive user experience and efficient development process.

## Detailed Design

### Technology Stack
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Heroicons**: Beautiful hand-crafted SVG icons
- **clsx**: Utility for constructing className strings
- **tailwind-merge**: Smart way to merge Tailwind CSS classes

### Core Libraries and Usage

#### 1. Headless UI (@headlessui/react)
- Used for complex interactive components
- Provides accessibility out of the box
- Components include:
  - Menu (dropdowns)
  - Dialog (modals)
  - Disclosure
  - Switch
  - Tabs
  - Listbox
  - Combobox
  - Radio Group

#### 2. Heroicons (@heroicons/react)
- Official icon set
- Available in three styles:
  - Solid (/20/solid)
  - Outline (/24/outline)
  - Mini (/20/solid)
- Used consistently across the application

#### 3. Utility Functions
```typescript
// Class name merging utility
import { cn } from '@/lib/utils'

// Usage
className={cn(
  'base-classes',
  conditional && 'conditional-classes',
  'more-classes'
)}
```

### Design Tokens

#### Colors
- Primary: Indigo
- Gray scale for text and backgrounds
- Semantic colors for status:
  - Success: Green
  - Error: Red
  - Warning: Yellow
  - Info: Blue

#### Typography
- Font Family: Inter
- Scale:
  - xs: 0.75rem
  - sm: 0.875rem
  - base: 1rem
  - lg: 1.125rem
  - xl: 1.25rem
  - 2xl: 1.5rem

#### Spacing
Following Tailwind's default spacing scale

#### Border Radius
- sm: 0.125rem
- DEFAULT: 0.25rem
- md: 0.375rem
- lg: 0.5rem
- full: 9999px

### Component Architecture

#### Base Components
- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Card
- Badge

#### Composite Components
- Form fields
- Data tables
- Navigation menus
- Modal dialogs
- Alerts
- Toasts

### Implementation Guidelines

#### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  // Props interface
}

export function Component({ ...props }: ComponentProps) {
  return (
    // JSX
  )
}
```

#### Styling Approach
1. Use Tailwind utility classes
2. Use cn() for conditional classes
3. Follow mobile-first responsive design
4. Use semantic color tokens

### Best Practices
1. All interactive elements must be keyboard accessible
2. Maintain WCAG 2.1 AA compliance
3. Support dark mode where applicable
4. Ensure responsive behavior
5. Write comprehensive component documentation

## Testing Strategy
1. Component unit tests
2. Visual regression tests
3. Accessibility tests
4. Responsive design tests

## Security Considerations
1. Sanitize user input
2. Prevent XSS in dynamic content
3. Secure form handling
4. Safe SVG rendering

## Performance
1. Code splitting
2. Tree shaking
3. Optimized asset loading
4. Minimal bundle size

## Migration Strategy
1. Create base components
2. Document usage patterns
3. Gradually replace existing components
4. Maintain backward compatibility

## References
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [class-variance-authority Documentation](https://cva.style/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) 