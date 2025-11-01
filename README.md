# Virtual Meeting Manager

A comprehensive React component for managing virtual meetings, converted from Bubble.io. This component handles scheduling, responding to meeting requests, canceling meetings, and viewing meeting details with Google Calendar integration.

## Features

- 📅 **Respond to Meeting Requests** - Select from proposed time slots or decline
- 🗓️ **Book Virtual Meetings** - Create new meeting requests with an interactive calendar
- ❌ **Cancel Meetings** - Confirmation dialog for canceling existing meetings
- 📋 **View Meeting Details** - Display booked meeting information with Google Calendar integration
- 🌍 **EST Timezone Support** - All times displayed in Eastern Standard Time
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ♿ **Accessible** - ARIA labels and keyboard navigation support

## Installation

### From GitHub

```bash
git clone https://github.com/splitleasesharath/virtual-meeting-manager.git
cd virtual-meeting-manager
npm install
```

### As a Package

```bash
npm install virtual-meeting-manager
```

## Quick Start

```tsx
import React from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';

function App() {
  const proposal = {
    id: 'proposal-123',
    host: {
      id: 'user-1',
      name: 'John Doe',
      firstName: 'John',
      email: 'john@example.com',
      typeUserSignup: 'host',
    },
    guest: {
      id: 'user-2',
      name: 'Jane Smith',
      firstName: 'Jane',
      email: 'jane@example.com',
      typeUserSignup: 'guest',
    },
    listing: {
      id: 'listing-1',
      name: 'Beautiful Downtown Apartment',
    },
    availableTimes: [
      new Date('2025-11-05T14:00:00'),
      new Date('2025-11-05T16:00:00'),
      new Date('2025-11-06T10:00:00'),
    ],
    nights: ['Monday', 'Wednesday', 'Friday'],
    reservationSpan: 4,
    status: 'pending',
  };

  const currentUser = {
    id: 'user-2',
    name: 'Jane Smith',
    firstName: 'Jane',
    email: 'jane@example.com',
    typeUserSignup: 'guest',
  };

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView="respond"
      currentUser={currentUser}
      onClose={() => console.log('Modal closed')}
    />
  );
}

export default App;
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_BUBBLE_API_BASE=https://your-app.bubbleapps.io/api/1.1/wf
```

See `.env.example` for all available configuration options.

## Component Props

### VirtualMeetingManager

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `proposal` | `Proposal` | Yes | Meeting proposal data |
| `initialView` | `ViewState` | No | Initial view to display ('respond', 'request', 'cancel', 'details', '') |
| `currentUser` | `User` | Yes | Current logged-in user |
| `onClose` | `() => void` | Yes | Callback when modal is closed |

### BookTimeSlot

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialStartTime` | `number` | 8 | Starting hour (24-hour format) |
| `initialEndTime` | `number` | 20 | Ending hour (24-hour format) |
| `interval` | `number` | 30 | Time slot interval in minutes |
| `maxSelections` | `number` | 3 | Maximum number of time slots |
| `onSelectionChange` | `(slots: Date[]) => void` | - | Callback when selection changes |
| `timezone` | `string` | 'America/New_York' | Timezone for display |

## Views

### 1. Respond to VM Request

Allows users to:
- Select from up to 4 proposed time slots
- Decline the meeting request
- Suggest alternative times

```tsx
<VirtualMeetingManager
  proposal={proposal}
  initialView="respond"
  currentUser={currentUser}
  onClose={handleClose}
/>
```

### 2. Book/Request Virtual Meeting

Provides an interactive calendar to:
- Select exactly 3 time slots
- Navigate through months
- View available times in EST
- Submit meeting request or alternative times

```tsx
<VirtualMeetingManager
  proposal={proposal}
  initialView="request"
  currentUser={currentUser}
  onClose={handleClose}
/>
```

### 3. Cancel Virtual Meeting

Shows a confirmation dialog with:
- Meeting details
- Participant information
- Warning about irreversibility
- Cancel/Confirm buttons

```tsx
<VirtualMeetingManager
  proposal={proposal}
  initialView="cancel"
  currentUser={currentUser}
  onClose={handleClose}
/>
```

### 4. Meeting Details

Displays:
- Booked date and time
- Guest information
- Listing details
- Google Calendar integration button
- Google Meet link (if available)

```tsx
<VirtualMeetingManager
  proposal={proposal}
  initialView="details"
  currentUser={currentUser}
  onClose={handleClose}
/>
```

## API Integration

The component integrates with Bubble.io backend workflows:

### Available API Methods

```typescript
import { virtualMeetingService } from 'virtual-meeting-manager';

// Accept a virtual meeting
await virtualMeetingService.acceptMeeting(proposalId, bookedDate, userAcceptingId);

// Create a meeting request
await virtualMeetingService.createRequest(proposalId, timesSelected, requestedById, isAlternativeTimes);

// Decline a meeting
await virtualMeetingService.declineMeeting(proposalId);

// Cancel a meeting
await virtualMeetingService.cancelMeeting(meetingId, proposalId);

// Send Google Calendar invite
await virtualMeetingService.sendGoogleCalendar(proposalId, userId);

// Notify participants
await virtualMeetingService.notifyParticipants(hostId, guestId, virtualMeetingId);

// Upload video
await virtualMeetingService.uploadVideo(videoFile, listingId, guestId);
```

### Backend Workflows

The component expects these Bubble.io workflows to be available:

1. **accept-virtual-meeting** - Accepts a meeting and updates schedules
2. **CORE-create-virtual-meeting** - Creates new meeting requests
3. **decline-virtual-meeting** - Declines a meeting request
4. **cancel-virtual-meeting** - Cancels an existing meeting
5. **l3-trigger-send-google-calend** - Sends Google Calendar invites
6. **notify-virtual-meeting-partici** - Notifies participants
7. **upload_video** - Uploads meeting videos

See `src/services/virtualMeetingAPI.ts` for complete API documentation.

## Type Definitions

### Core Types

```typescript
interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  profilePhoto?: string;
  typeUserSignup: 'host' | 'guest';
}

interface Listing {
  id: string;
  name: string;
}

interface Proposal {
  id: string;
  host: User;
  guest: User;
  listing: Listing;
  availableTimes: Date[];
  nights: string[];
  reservationSpan: number;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  virtualMeeting?: VirtualMeetingSchedule;
}

interface VirtualMeetingSchedule {
  id: string;
  proposalId: string;
  proposedTimes: Date[];
  bookedDate?: Date;
  googleMeetLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
}
```

See `src/types/index.ts` for all type definitions.

## Styling

The component uses CSS Modules for styling. You can customize the appearance by:

1. **Overriding CSS Variables** (if implemented)
2. **Using Custom CSS Classes**
3. **Modifying the source CSS files**

### Color Palette

- Primary Purple: `#7b2cbf`
- Danger Red: `#dc2626`
- Salmon/Pink: `#ffb3ba`
- Blue: `#3b82f6`
- Light Blue: `#dbeafe`
- Gray: `#6b7280`

## Utilities

### Date Utilities

```typescript
import { formatTimeEST, generateTimeSlots, toEST, toUTC } from 'virtual-meeting-manager';

// Format date in EST timezone
const formatted = formatTimeEST(new Date(), 'MMM d, yyyy h:mm a');

// Generate time slots
const slots = generateTimeSlots(new Date(), 8, 20, 30);

// Convert between timezones
const estDate = toEST(utcDate);
const utcDate = toUTC(estDate);
```

See `src/utils/dateUtils.ts` for all available utilities.

## Development

### Setup

```bash
git clone https://github.com/splitleasesharath/virtual-meeting-manager.git
cd virtual-meeting-manager
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Testing

```bash
npm test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires ES2020+ support and modern Date APIs.

## Dependencies

### Production

- `date-fns`: Date manipulation and formatting
- `date-fns-tz`: Timezone support

### Peer Dependencies

- `react`: ^18.0.0
- `react-dom`: ^18.0.0

## Migration from Bubble

This component is a direct conversion from the Bubble.io "respond-request-cancel-vm" reusable element. Key differences:

1. **State Management**: Bubble custom states → React useState hooks
2. **Conditionals**: Bubble conditionals → JSX conditional rendering
3. **Workflows**: Bubble workflows → Async event handlers
4. **Repeating Groups**: Bubble RG → Array.map() functions
5. **API Calls**: Bubble backend workflows → Fetch API

## Troubleshooting

### Common Issues

**Issue**: Times not displaying correctly
- **Solution**: Ensure timezone is set to 'America/New_York' in configuration

**Issue**: API calls failing
- **Solution**: Check REACT_APP_BUBBLE_API_BASE in .env file

**Issue**: Calendar not showing dates
- **Solution**: Verify date-fns and date-fns-tz are installed

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: https://github.com/splitleasesharath/virtual-meeting-manager/issues
- Email: support@splitlease.com

## Changelog

### Version 1.0.0 (2025-11-01)
- Initial release
- Complete Bubble.io conversion
- All 4 views implemented
- Full TypeScript support
- Comprehensive API integration

## Credits

Created by Split Lease Team
Converted from Bubble.io by Claude Code

---

**Note**: This component requires a Bubble.io backend with the appropriate workflows configured. Ensure all API endpoints are available before use.
