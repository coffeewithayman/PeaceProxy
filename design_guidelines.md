# Design Guidelines: Co-Parent Message Moderation App

## Design Approach: Design System Foundation
**Selected System**: Material Design with emphasis on clarity, trust, and calm professionalism

**Justification**: This is a utility-focused application dealing with sensitive co-parenting communication. The design must inspire trust, reduce anxiety, and provide crystal-clear feedback. Material Design's structured approach to status indicators, notifications, and information hierarchy is ideal for this context.

**Core Principles**:
- Calming and professional aesthetics to reduce conflict
- Clear visual hierarchy for message status and feedback
- Trust-building through consistency and reliability
- Minimal cognitive load during emotional situations

## Color Palette

**Light Mode**:
- Primary: 210 65% 45% (Trustworthy blue)
- Primary Variant: 210 70% 35% (Darker blue for emphasis)
- Surface: 0 0% 98% (Soft white backgrounds)
- Surface Variant: 210 20% 95% (Subtle card backgrounds)
- Success: 145 60% 42% (Message approved)
- Warning: 35 90% 55% (Message flagged for review)
- Error: 355 75% 50% (Message blocked)
- Text Primary: 210 15% 20%
- Text Secondary: 210 10% 45%

**Dark Mode**:
- Primary: 210 75% 55% (Brighter blue for contrast)
- Primary Variant: 210 80% 65%
- Surface: 210 12% 12% (Deep background)
- Surface Variant: 210 12% 16% (Card backgrounds)
- Success: 145 50% 50%
- Warning: 35 85% 60%
- Error: 355 70% 55%
- Text Primary: 210 10% 95%
- Text Secondary: 210 8% 70%

## Typography

**Font Families**:
- Primary: 'Inter' (Clean, professional, excellent readability)
- Monospace: 'JetBrains Mono' (For message content and timestamps)

**Type Scale**:
- Display: 2.5rem/600 (Dashboard headers)
- H1: 2rem/600 (Section titles)
- H2: 1.5rem/600 (Card headers)
- H3: 1.25rem/600 (Subsections)
- Body: 1rem/400 (Primary content)
- Body Small: 0.875rem/400 (Secondary info, timestamps)
- Caption: 0.75rem/500 (Labels, hints)

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units **2, 4, 8, 12, 16** for all spacing
- Component padding: p-4 to p-8
- Section spacing: gap-8 to gap-12
- Page margins: px-4 md:px-8
- Card spacing: p-6

**Grid Structure**:
- Dashboard: Single column mobile, 12-column grid desktop
- Message list: Full-width cards with consistent spacing (space-y-4)
- Status panels: 2-column grid on tablet+, stacked mobile

## Component Library

**Navigation**:
- Top bar with logo, user indicator, and settings icon
- Minimal navigation - focus on primary dashboard view
- Mobile: Hamburger menu with slide-out drawer

**Message Cards**:
- Rounded cards (rounded-lg) with subtle shadows
- Color-coded left border indicating status (4px width):
  - Green: Approved and sent
  - Yellow: Under review
  - Red: Blocked
- Header: Sender/recipient, timestamp (text-sm, text-secondary)
- Body: Message preview with truncation
- Footer: Status badge and action buttons

**Status Indicators**:
- Pills/badges with icon + text
- Soft backgrounds matching status colors
- Clear iconography (checkmark, warning triangle, X)

**Feedback Panels**:
- Expandable sections showing AI analysis
- Soft yellow background for suggestions
- Bulleted feedback with constructive recommendations
- "Send Anyway" and "Edit Message" CTAs

**Dashboard Widgets**:
- Statistics cards: Total messages, blocked %, successful deliveries
- Recent activity timeline with vertical connector lines
- Quick actions: Common templates, emergency override

**Forms**:
- Clean input fields with floating labels
- Clear error states with inline validation
- Subtle focus rings (ring-2 ring-primary)
- Helper text below inputs

**Buttons**:
- Primary: Filled with primary color (Send, Approve)
- Secondary: Outlined (Cancel, Review)
- Destructive: Red filled (Block, Delete)
- Sizes: Default (px-4 py-2), Large (px-6 py-3)

**Data Displays**:
- Message history: Reverse chronological list
- Filter tabs: Pill-style toggles (All, Blocked, Approved)
- Search bar: Prominent placement with icon

**Overlays**:
- Modal dialogs for message details and editing
- Toast notifications for actions (message blocked, sent)
- Confirmation dialogs for destructive actions

## Animations

Use sparingly and purposefully:
- Toast slide-in from top (200ms ease-out)
- Card hover: subtle lift (translate-y-1, shadow increase)
- Status transitions: gentle color fade (300ms)
- Loading states: Minimal spinner for API calls

No decorative or distracting animations - maintain calm, professional feel.

## Images

**No hero image required** - This is a utility dashboard focused on functionality.

**Icon Usage**: Font Awesome via CDN for status icons (check-circle, exclamation-triangle, times-circle, paper-plane, user-shield)

## Accessibility & Dark Mode

- Maintain WCAG AA contrast ratios minimum
- Full dark mode support across all components
- Form inputs maintain consistent styling in dark mode
- Focus indicators clearly visible in both modes
- Screen reader labels for all interactive elements
- Keyboard navigation support throughout