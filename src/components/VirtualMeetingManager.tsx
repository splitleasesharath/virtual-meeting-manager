/**
 * Virtual Meeting Manager - Main Component
 * Manages 4 different views for virtual meeting workflows:
 * 1. Respond to VM Request - Select from proposed times or decline
 * 2. Book/Request Virtual Meeting - Create new meeting request with calendar
 * 3. Cancel Virtual Meetings - Confirmation dialog for cancellation
 * 4. Details of proposal and VM - Display booked meeting info with Google Calendar integration
 */

import React, { useState, useEffect } from 'react';
import { VirtualMeetingManagerProps, ViewState } from '../types';
import virtualMeetingService from '../services/virtualMeetingAPI';
import RespondToVMRequest from './RespondToVMRequest';
import BookVirtualMeeting from './BookVirtualMeeting';
import CancelVirtualMeetings from './CancelVirtualMeetings';
import DetailsOfProposalAndVM from './DetailsOfProposalAndVM';
import styles from '../styles/VirtualMeetingManager.module.css';

const VirtualMeetingManager: React.FC<VirtualMeetingManagerProps> = ({
  proposal,
  initialView = '',
  onClose,
  currentUser,
}) => {
  // State management
  const [view, setView] = useState<ViewState>(initialView);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [reloadOnParti, setReloadOnParti] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  /**
   * Handle confirming a time slot selection
   */
  const handleConfirmTime = async (selectedTime: Date) => {
    try {
      const result = await virtualMeetingService.acceptMeeting(
        proposal.id,
        selectedTime,
        currentUser.id
      );

      if (result.status === 'success') {
        setSuccess('Meeting confirmed successfully!');
        // Switch to details view after successful confirmation
        setTimeout(() => {
          setView('details');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to confirm meeting');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm meeting');
      throw err;
    }
  };

  /**
   * Handle declining a meeting request
   */
  const handleDecline = async () => {
    try {
      const result = await virtualMeetingService.declineMeeting(proposal.id);

      if (result.status === 'success') {
        setSuccess('Meeting declined');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to decline meeting');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline meeting');
      throw err;
    }
  };

  /**
   * Handle suggesting alternative times
   */
  const handleSuggestAlternatives = () => {
    setIsSuggesting(true);
    setView('request');
  };

  /**
   * Handle submitting meeting request or alternative times
   */
  const handleSubmitRequest = async (slots: Date[], isSuggesting: boolean) => {
    try {
      const result = await virtualMeetingService.createRequest(
        proposal.id,
        slots,
        currentUser.id,
        isSuggesting,
        'America/New_York'
      );

      if (result.status === 'success') {
        setSuccess(
          isSuggesting
            ? 'Alternative times submitted successfully!'
            : 'Meeting request sent successfully!'
        );
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to submit request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
      throw err;
    }
  };

  /**
   * Handle canceling a virtual meeting
   */
  const handleCancelMeeting = async () => {
    if (!proposal.virtualMeeting) return;

    try {
      const result = await virtualMeetingService.cancelMeeting(
        proposal.virtualMeeting.id,
        proposal.id
      );

      if (result.status === 'success') {
        setSuccess('Meeting canceled successfully');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to cancel meeting');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel meeting');
      throw err;
    }
  };

  /**
   * Handle going back from request view
   */
  const handleBack = () => {
    setIsSuggesting(false);
    setView('respond');
  };

  // Determine participant name for cancel dialog
  const getParticipantName = () => {
    if (currentUser.typeUserSignup === 'host') {
      return proposal.guest.firstName;
    }
    return proposal.host.name;
  };

  // Don't render if no view is set
  if (!view) {
    return null;
  }

  return (
    <div className={styles.vmOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.vmContainer}>
        {/* Global Error/Success Messages */}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Respond to VM Request View */}
        {view === 'respond' && (
          <RespondToVMRequest
            proposal={proposal}
            onConfirm={handleConfirmTime}
            onDecline={handleDecline}
            onSuggestAlt={handleSuggestAlternatives}
          />
        )}

        {/* Book/Request Virtual Meeting View */}
        {view === 'request' && (
          <BookVirtualMeeting
            proposal={proposal}
            isSuggesting={isSuggesting}
            onSubmit={handleSubmitRequest}
            onBack={handleBack}
            currentUser={currentUser}
          />
        )}

        {/* Cancel Virtual Meeting View */}
        {view === 'cancel' && proposal.virtualMeeting && (
          <CancelVirtualMeetings
            meeting={proposal.virtualMeeting}
            participantName={getParticipantName()}
            listingName={proposal.listing.name}
            onCancel={handleCancelMeeting}
            onClose={onClose}
          />
        )}

        {/* Details of Proposal and VM View */}
        {view === 'details' && proposal.virtualMeeting && (
          <DetailsOfProposalAndVM
            proposal={proposal}
            meeting={proposal.virtualMeeting}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default VirtualMeetingManager;
