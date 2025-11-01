# Virtual Meeting Manager - Usage Examples

This document provides comprehensive examples of how to use the Virtual Meeting Manager component in various scenarios.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Integration Examples](#integration-examples)
3. [Advanced Usage](#advanced-usage)
4. [Custom Styling](#custom-styling)
5. [Error Handling](#error-handling)
6. [Real-World Scenarios](#real-world-scenarios)

---

## Basic Usage

### Example 1: Simple Meeting Response Modal

```tsx
import React, { useState } from 'react';
import { VirtualMeetingManager, Proposal, User } from 'virtual-meeting-manager';

function MeetingResponseModal() {
  const [isOpen, setIsOpen] = useState(true);

  const proposal: Proposal = {
    id: 'prop-001',
    host: {
      id: 'host-001',
      name: 'John Doe',
      firstName: 'John',
      email: 'john@example.com',
      typeUserSignup: 'host',
    },
    guest: {
      id: 'guest-001',
      name: 'Jane Smith',
      firstName: 'Jane',
      email: 'jane@example.com',
      typeUserSignup: 'guest',
    },
    listing: {
      id: 'listing-001',
      name: '2BR Apartment in Downtown',
    },
    availableTimes: [
      new Date('2025-11-05T14:00:00Z'),
      new Date('2025-11-05T16:00:00Z'),
      new Date('2025-11-06T10:00:00Z'),
    ],
    nights: ['Monday', 'Wednesday', 'Friday'],
    reservationSpan: 4,
    status: 'pending',
  };

  const currentUser: User = {
    id: 'guest-001',
    name: 'Jane Smith',
    firstName: 'Jane',
    email: 'jane@example.com',
    typeUserSignup: 'guest',
  };

  if (!isOpen) return null;

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView="respond"
      currentUser={currentUser}
      onClose={() => setIsOpen(false)}
    />
  );
}

export default MeetingResponseModal;
```

---

## Integration Examples

### Example 2: Integration with React Router

```tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import { useProposal } from './hooks/useProposal';
import { useCurrentUser } from './hooks/useCurrentUser';

function MeetingPage() {
  const { proposalId, view } = useParams();
  const navigate = useNavigate();
  const { proposal, loading } = useProposal(proposalId);
  const { currentUser } = useCurrentUser();

  if (loading) return <div>Loading...</div>;
  if (!proposal || !currentUser) return <div>Not found</div>;

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView={view as any}
      currentUser={currentUser}
      onClose={() => navigate('/dashboard')}
    />
  );
}

export default MeetingPage;
```

### Example 3: Integration with Redux

```tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import { closeMeetingModal, selectCurrentProposal, selectCurrentUser } from './store/meetingSlice';

function MeetingModal() {
  const dispatch = useDispatch();
  const proposal = useSelector(selectCurrentProposal);
  const currentUser = useSelector(selectCurrentUser);
  const { isOpen, view } = useSelector((state: any) => state.meeting.modal);

  if (!isOpen || !proposal || !currentUser) return null;

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView={view}
      currentUser={currentUser}
      onClose={() => dispatch(closeMeetingModal())}
    />
  );
}

export default MeetingModal;
```

### Example 4: Integration with Context API

```tsx
import React, { useContext } from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import { MeetingContext } from './contexts/MeetingContext';
import { AuthContext } from './contexts/AuthContext';

function MeetingModalWrapper() {
  const { currentProposal, modalView, closeMeetingModal } = useContext(MeetingContext);
  const { currentUser } = useContext(AuthContext);

  if (!currentProposal || !currentUser) return null;

  return (
    <VirtualMeetingManager
      proposal={currentProposal}
      initialView={modalView}
      currentUser={currentUser}
      onClose={closeMeetingModal}
    />
  );
}

export default MeetingModalWrapper;
```

---

## Advanced Usage

### Example 5: With Data Fetching

```tsx
import React, { useEffect, useState } from 'react';
import { VirtualMeetingManager, Proposal, User } from 'virtual-meeting-manager';

function MeetingContainer({ proposalId }: { proposalId: string }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [proposalRes, userRes] = await Promise.all([
          fetch(`/api/proposals/${proposalId}`),
          fetch('/api/users/current'),
        ]);

        if (!proposalRes.ok || !userRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const proposalData = await proposalRes.json();
        const userData = await userRes.json();

        setProposal(proposalData);
        setCurrentUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [proposalId]);

  if (loading) return <div>Loading meeting details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!proposal || !currentUser) return <div>No data available</div>;

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView="respond"
      currentUser={currentUser}
      onClose={() => window.history.back()}
    />
  );
}

export default MeetingContainer;
```

### Example 6: With Custom Callbacks

```tsx
import React from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import { toast } from 'react-toastify';
import { analytics } from './services/analytics';

function MeetingWithCallbacks({ proposal, currentUser, onClose }) {
  const handleClose = () => {
    analytics.track('meeting_modal_closed');
    onClose();
  };

  // Wrap the component with custom event tracking
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          analytics.track('meeting_modal_backdrop_clicked');
        }
      }}
    >
      <VirtualMeetingManager
        proposal={proposal}
        initialView="respond"
        currentUser={currentUser}
        onClose={handleClose}
      />
    </div>
  );
}

export default MeetingWithCallbacks;
```

### Example 7: Conditional Rendering Based on User Role

```tsx
import React from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';

function RoleBasedMeetingModal({ proposal, currentUser, onClose }) {
  // Determine initial view based on user role and proposal status
  const getInitialView = () => {
    if (proposal.status === 'confirmed') return 'details';
    if (proposal.status === 'cancelled') return null;

    if (currentUser.typeUserSignup === 'host') {
      return proposal.virtualMeeting ? 'details' : 'request';
    } else {
      return 'respond';
    }
  };

  const initialView = getInitialView();

  if (!initialView) {
    return <div>This meeting has been cancelled.</div>;
  }

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView={initialView}
      currentUser={currentUser}
      onClose={onClose}
    />
  );
}

export default RoleBasedMeetingModal;
```

---

## Custom Styling

### Example 8: Custom Theme with CSS Variables

```tsx
import React from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import './customTheme.css';

function ThemedMeetingModal({ proposal, currentUser, onClose }) {
  return (
    <div className="custom-meeting-theme">
      <VirtualMeetingManager
        proposal={proposal}
        initialView="respond"
        currentUser={currentUser}
        onClose={onClose}
      />
    </div>
  );
}

export default ThemedMeetingModal;
```

**customTheme.css:**
```css
.custom-meeting-theme {
  --vm-primary-color: #9333ea;
  --vm-danger-color: #ef4444;
  --vm-success-color: #22c55e;
  --vm-border-radius: 16px;
  --vm-font-family: 'Inter', sans-serif;
}
```

---

## Error Handling

### Example 9: Comprehensive Error Handling

```tsx
import React, { useState } from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import ErrorBoundary from './components/ErrorBoundary';

function SafeMeetingModal({ proposal, currentUser, onClose }) {
  const [apiError, setApiError] = useState<string | null>(null);

  return (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Unable to load the meeting interface.</p>
          <button onClick={onClose}>Close</button>
        </div>
      }
      onError={(error) => {
        console.error('Meeting Modal Error:', error);
        setApiError(error.message);
      }}
    >
      {apiError && (
        <div style={{ background: '#fee2e2', padding: '12px', margin: '12px' }}>
          Error: {apiError}
        </div>
      )}
      <VirtualMeetingManager
        proposal={proposal}
        initialView="respond"
        currentUser={currentUser}
        onClose={onClose}
      />
    </ErrorBoundary>
  );
}

export default SafeMeetingModal;
```

---

## Real-World Scenarios

### Example 10: Dashboard Integration

```tsx
import React, { useState } from 'react';
import { VirtualMeetingManager, Proposal, User } from 'virtual-meeting-manager';

function ProposalsDashboard() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [modalView, setModalView] = useState<string>('');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const currentUser: User = { /* current user data */ };

  const handleRespondToMeeting = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setModalView('respond');
  };

  const handleRequestMeeting = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setModalView('request');
  };

  const handleViewDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setModalView('details');
  };

  const handleCancelMeeting = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setModalView('cancel');
  };

  return (
    <div className="dashboard">
      <h1>My Proposals</h1>

      <div className="proposals-list">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="proposal-card">
            <h3>{proposal.listing.name}</h3>
            <p>With: {proposal.guest.firstName}</p>
            <p>Status: {proposal.status}</p>

            <div className="actions">
              {proposal.status === 'pending' && (
                <>
                  <button onClick={() => handleRespondToMeeting(proposal)}>
                    Respond
                  </button>
                  <button onClick={() => handleRequestMeeting(proposal)}>
                    Request Meeting
                  </button>
                </>
              )}
              {proposal.status === 'confirmed' && (
                <>
                  <button onClick={() => handleViewDetails(proposal)}>
                    View Details
                  </button>
                  <button onClick={() => handleCancelMeeting(proposal)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProposal && (
        <VirtualMeetingManager
          proposal={selectedProposal}
          initialView={modalView as any}
          currentUser={currentUser}
          onClose={() => {
            setSelectedProposal(null);
            setModalView('');
          }}
        />
      )}
    </div>
  );
}

export default ProposalsDashboard;
```

### Example 11: Notification Integration

```tsx
import React from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';
import { toast } from 'react-toastify';

function MeetingWithNotifications({ proposal, currentUser, onClose }) {
  const handleCloseWithSuccess = () => {
    toast.success('Meeting action completed successfully!');
    onClose();
  };

  const handleCloseWithCancel = () => {
    toast.info('Meeting action cancelled');
    onClose();
  };

  // Monitor for successful actions by wrapping the component
  React.useEffect(() => {
    const originalClose = onClose;

    // You can add custom logic here to detect success vs cancel
    return () => {
      // Cleanup
    };
  }, [onClose]);

  return (
    <VirtualMeetingManager
      proposal={proposal}
      initialView="respond"
      currentUser={currentUser}
      onClose={handleCloseWithSuccess}
    />
  );
}

export default MeetingWithNotifications;
```

### Example 12: Mobile-Optimized Implementation

```tsx
import React, { useEffect, useState } from 'react';
import { VirtualMeetingManager } from 'virtual-meeting-manager';

function MobileMeetingModal({ proposal, currentUser, onClose }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll on mobile when modal is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        ...(isMobile && {
          height: '100vh',
          overflow: 'auto',
        }),
      }}
    >
      <VirtualMeetingManager
        proposal={proposal}
        initialView="respond"
        currentUser={currentUser}
        onClose={onClose}
      />
    </div>
  );
}

export default MobileMeetingModal;
```

---

## Tips and Best Practices

### Performance Optimization

1. **Lazy Loading**: Load the component only when needed
```tsx
const VirtualMeetingManager = React.lazy(() =>
  import('virtual-meeting-manager').then(module => ({
    default: module.VirtualMeetingManager
  }))
);
```

2. **Memoization**: Prevent unnecessary re-renders
```tsx
const MemoizedMeetingModal = React.memo(VirtualMeetingManager);
```

3. **Data Caching**: Cache proposal data to reduce API calls
```tsx
import { useQuery } from 'react-query';

const { data: proposal } = useQuery(
  ['proposal', proposalId],
  () => fetchProposal(proposalId),
  { staleTime: 5 * 60 * 1000 } // 5 minutes
);
```

### Accessibility

Always provide appropriate ARIA labels and ensure keyboard navigation:

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="meeting-title">
  <VirtualMeetingManager {...props} />
</div>
```

### Testing

Example test setup:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtualMeetingManager } from 'virtual-meeting-manager';

test('renders meeting response modal', () => {
  const props = {
    proposal: mockProposal,
    currentUser: mockUser,
    initialView: 'respond',
    onClose: jest.fn(),
  };

  render(<VirtualMeetingManager {...props} />);

  expect(screen.getByText('Virtual Meeting Response')).toBeInTheDocument();
});
```

---

For more examples and advanced use cases, please refer to the main README.md or contact support.
