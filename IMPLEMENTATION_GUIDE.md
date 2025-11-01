# Virtual Meeting Manager - Implementation Guide

## Quick Start Checklist

Follow these steps to get the Virtual Meeting Manager component running in your project:

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/splitleasesharath/virtual-meeting-manager.git
cd virtual-meeting-manager

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Bubble.io API endpoint
REACT_APP_BUBBLE_API_BASE=https://your-app.bubbleapps.io/api/1.1/wf
```

### 3. Build the Component

```bash
# Build TypeScript files
npm run build

# For development with watch mode
npm run dev
```

### 4. Integration into Your Project

#### Option A: Direct Import (After Building)

```tsx
import { VirtualMeetingManager } from './path-to-virtual-meeting-manager/dist';

function App() {
  // Your implementation here
}
```

#### Option B: As a Package (Recommended)

```bash
# In your main project
npm install ../virtual-meeting-manager

# Or publish to npm first
```

```tsx
import { VirtualMeetingManager } from 'virtual-meeting-manager';
```

### 5. Configure Your Backend

Ensure these Bubble.io workflows exist:

- ✅ `accept-virtual-meeting`
- ✅ `CORE-create-virtual-meeting`
- ✅ `decline-virtual-meeting` (create if not exists)
- ✅ `cancel-virtual-meeting` (create if not exists)
- ✅ `l3-trigger-send-google-calend`
- ✅ `notify-virtual-meeting-partici`
- ✅ `upload_video`

### 6. Test Implementation

```tsx
import React, { useState } from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';

function TestComponent() {
  const [isOpen, setIsOpen] = useState(true);

  const testProposal = {
    id: 'test-001',
    host: {
      id: 'host-001',
      name: 'Test Host',
      firstName: 'Test',
      email: 'host@test.com',
      typeUserSignup: 'host' as const,
    },
    guest: {
      id: 'guest-001',
      name: 'Test Guest',
      firstName: 'Guest',
      email: 'guest@test.com',
      typeUserSignup: 'guest' as const,
    },
    listing: {
      id: 'listing-001',
      name: 'Test Listing',
    },
    availableTimes: [
      new Date('2025-11-05T14:00:00Z'),
      new Date('2025-11-05T16:00:00Z'),
    ],
    nights: ['Monday', 'Wednesday'],
    reservationSpan: 4,
    status: 'pending' as const,
  };

  const currentUser = testProposal.guest;

  if (!isOpen) return <button onClick={() => setIsOpen(true)}>Open Modal</button>;

  return (
    <VirtualMeetingManager
      proposal={testProposal}
      initialView="respond"
      currentUser={currentUser}
      onClose={() => setIsOpen(false)}
    />
  );
}

export default TestComponent;
```

---

## File Structure

```
virtual-meeting-manager/
├── src/
│   ├── components/
│   │   ├── VirtualMeetingManager.tsx    # Main component
│   │   ├── RespondToVMRequest.tsx       # Respond view
│   │   ├── BookVirtualMeeting.tsx       # Request view
│   │   ├── CancelVirtualMeetings.tsx    # Cancel view
│   │   ├── DetailsOfProposalAndVM.tsx   # Details view
│   │   └── BookTimeSlot.tsx             # Calendar component
│   ├── types/
│   │   └── index.ts                     # TypeScript types
│   ├── services/
│   │   └── virtualMeetingAPI.ts         # API service layer
│   ├── utils/
│   │   └── dateUtils.ts                 # Date utilities
│   ├── styles/
│   │   ├── VirtualMeetingManager.module.css
│   │   ├── RespondToVMRequest.module.css
│   │   ├── BookTimeSlot.module.css
│   │   └── DetailsOfProposalAndVM.module.css
│   └── index.ts                         # Main export file
├── dist/                                 # Build output (generated)
├── .env.example                         # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── USAGE_EXAMPLES.md
└── IMPLEMENTATION_GUIDE.md (this file)
```

---

## Component Architecture

```
VirtualMeetingManager (Main Container)
│
├── State Management
│   ├── view: ViewState
│   ├── isSuggesting: boolean
│   ├── reloadOnParti: boolean
│   ├── error: string | null
│   └── success: string | null
│
├── View: "respond"
│   └── RespondToVMRequest
│       ├── Time slot radio buttons
│       ├── Decline button
│       ├── Suggest alternative button
│       └── Confirmation dialog
│
├── View: "request"
│   └── BookVirtualMeeting
│       ├── BookTimeSlot (Calendar)
│       │   ├── Month navigation
│       │   ├── Calendar grid
│       │   ├── Time picker modal
│       │   └── Selected slots display
│       └── Submit button
│
├── View: "cancel"
│   └── CancelVirtualMeetings
│       ├── Warning message
│       ├── Meeting info card
│       └── Confirm/Cancel buttons
│
└── View: "details"
    └── DetailsOfProposalAndVM
        ├── Profile photo
        ├── Booked date display
        ├── Meeting details list
        ├── Google Calendar button
        └── Google Meet link
```

---

## API Integration Flow

### 1. Accept Meeting Flow

```
User selects time slot
     ↓
Confirmation dialog appears
     ↓
User confirms
     ↓
Call virtualMeetingService.acceptMeeting()
     ↓
POST /accept-virtual-meeting
     ↓
Backend updates database
     ↓
Backend sends notifications
     ↓
Success response
     ↓
Switch to "details" view
```

### 2. Request Meeting Flow

```
User opens calendar
     ↓
User selects 3 time slots
     ↓
User clicks "Submit Request"
     ↓
Call virtualMeetingService.createRequest()
     ↓
POST /CORE-create-virtual-meeting
     ↓
Backend creates meeting request
     ↓
Backend sends notifications
     ↓
Success response
     ↓
Close modal
```

### 3. Cancel Meeting Flow

```
User clicks cancel
     ↓
Confirmation dialog appears
     ↓
User confirms cancellation
     ↓
Call virtualMeetingService.cancelMeeting()
     ↓
POST /cancel-virtual-meeting
     ↓
Backend updates status
     ↓
Backend sends notifications
     ↓
Success response
     ↓
Close modal
```

---

## Customization Guide

### Customizing Colors

Edit `src/styles/VirtualMeetingManager.module.css`:

```css
/* Change primary color */
.buttonPrimary {
  background: #your-color; /* Change from #7b2cbf */
}

/* Change danger color */
.buttonDanger {
  background: #your-color; /* Change from #dc2626 */
}
```

### Customizing Time Slots

Edit component props:

```tsx
<BookTimeSlot
  initialStartTime={9}     // Start at 9 AM instead of 8 AM
  initialEndTime={18}      // End at 6 PM instead of 8 PM
  interval={60}            // 1-hour intervals instead of 30 min
  maxSelections={5}        // Allow 5 selections instead of 3
/>
```

### Adding Custom Validation

```tsx
const handleSubmitRequest = async (slots: Date[], isSuggesting: boolean) => {
  // Custom validation
  const hasWeekendSlot = slots.some(slot => {
    const day = slot.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });

  if (hasWeekendSlot) {
    setError('Please select weekday time slots only');
    return;
  }

  // Continue with normal flow
  await onSubmit(slots, isSuggesting);
};
```

---

## Troubleshooting

### Issue: API Calls Failing

**Symptom**: Errors when clicking submit buttons

**Solutions**:
1. Check `.env` file has correct API base URL
2. Verify Bubble.io workflows are published and accessible
3. Check browser console for CORS errors
4. Ensure API endpoints match exactly (case-sensitive)

```bash
# Test API endpoint
curl -X POST https://your-app.bubbleapps.io/api/1.1/wf/accept-virtual-meeting \
  -H "Content-Type: application/json" \
  -d '{"proposal":"test-id","booked_date_sel":"2025-11-05T14:00:00Z","user_accepting":"user-id"}'
```

### Issue: Times Displaying Incorrectly

**Symptom**: Times showing in wrong timezone

**Solutions**:
1. Verify timezone setting in `BookTimeSlot` component
2. Check that dates are being stored in UTC
3. Ensure `date-fns-tz` is installed correctly

```tsx
// Force EST timezone
<BookTimeSlot timezone="America/New_York" />
```

### Issue: Styling Not Applied

**Symptom**: Component looks unstyled

**Solutions**:
1. Ensure CSS modules are supported in your build system
2. Import CSS files correctly
3. Check for CSS naming conflicts

```tsx
// Correct import
import styles from '../styles/VirtualMeetingManager.module.css';

// Apply styles
<div className={styles.vmContainer}>
```

### Issue: TypeScript Errors

**Symptom**: Type errors when using component

**Solutions**:
1. Ensure `@types/react` is installed
2. Check TypeScript version compatibility (>= 5.0)
3. Verify types are exported correctly

```bash
npm install --save-dev @types/react @types/react-dom
```

---

## Performance Optimization

### 1. Code Splitting

```tsx
// Lazy load the component
const VirtualMeetingManager = React.lazy(() =>
  import('virtual-meeting-manager').then(m => ({ default: m.VirtualMeetingManager }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VirtualMeetingManager {...props} />
    </Suspense>
  );
}
```

### 2. Memoization

```tsx
import React, { useMemo } from 'react';

const MemoizedMeetingManager = React.memo(VirtualMeetingManager);

function ParentComponent() {
  const proposal = useMemo(() => ({
    // proposal data
  }), [dependencies]);

  return <MemoizedMeetingManager proposal={proposal} />;
}
```

### 3. API Call Caching

```tsx
import { useQuery } from 'react-query';

function useProposal(proposalId: string) {
  return useQuery(
    ['proposal', proposalId],
    () => fetch(`/api/proposals/${proposalId}`).then(r => r.json()),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}
```

---

## Testing

### Unit Test Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';

describe('VirtualMeetingManager', () => {
  const mockProps = {
    proposal: mockProposal,
    currentUser: mockUser,
    initialView: 'respond' as const,
    onClose: jest.fn(),
  };

  it('renders respond view', () => {
    render(<VirtualMeetingManager {...mockProps} />);
    expect(screen.getByText('Virtual Meeting Response')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<VirtualMeetingManager {...mockProps} />);
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
```

---

## Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Publish to npm (Optional)

```bash
# Update version in package.json
npm version patch

# Publish
npm publish
```

### 3. Use in Production

```tsx
// Install from npm
npm install virtual-meeting-manager

// Import and use
import { VirtualMeetingManager } from 'virtual-meeting-manager';
```

---

## Support

For issues or questions:

1. Check the [README.md](./README.md) for documentation
2. Review [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for examples
3. Open an issue on GitHub
4. Contact: support@splitlease.com

---

## Next Steps

After successful implementation:

1. ✅ Test all 4 views (respond, request, cancel, details)
2. ✅ Verify API integration with Bubble.io backend
3. ✅ Test on mobile devices
4. ✅ Add error tracking (Sentry, etc.)
5. ✅ Add analytics tracking
6. ✅ Performance testing
7. ✅ Accessibility audit
8. ✅ User acceptance testing

Good luck with your implementation! 🚀
