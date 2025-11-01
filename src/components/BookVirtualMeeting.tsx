/**
 * Book Virtual Meeting Component
 * Allows users to request a new meeting or suggest 3 alternative time slots
 */

import React, { useState } from 'react';
import { BookVirtualMeetingProps } from '../types';
import BookTimeSlot from './BookTimeSlot';
import commonStyles from '../styles/VirtualMeetingManager.module.css';

const BookVirtualMeeting: React.FC<BookVirtualMeetingProps> = ({
  proposal,
  isSuggesting,
  onSubmit,
  onBack,
  currentUser,
}) => {
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectionChange = (slots: Date[]) => {
    setSelectedSlots(slots);
  };

  const handleSubmit = async () => {
    if (selectedSlots.length !== 3) {
      setError('Please select exactly 3 time slots');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(selectedSlots, isSuggesting);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={commonStyles.vmHeader}>
        <button
          className={commonStyles.backBtn}
          onClick={onBack}
          disabled={isLoading}
          aria-label="Go back"
        >
          ←
        </button>
        <div className={commonStyles.vmHeaderTitle}>
          <h2 className={commonStyles.vmTitle}>
            {isSuggesting ? 'Suggest Alternative Times' : 'Request Virtual Meeting'}
          </h2>
        </div>
      </div>

      {error && <div className={commonStyles.error}>{error}</div>}

      <p className={commonStyles.vmDescription}>
        {isSuggesting
          ? `Propose 3 alternative time slots for ${proposal.host.name} to choose from.`
          : `Select 3 time slots when you're available to meet with ${
              currentUser.typeUserSignup === 'host'
                ? proposal.guest.firstName
                : proposal.host.name
            }.`}
      </p>

      {/* Calendar Component */}
      <BookTimeSlot
        maxSelections={3}
        onSelectionChange={handleSelectionChange}
        selectedSlots={selectedSlots}
        initialStartTime={8}
        initialEndTime={20}
        interval={30}
      />

      {/* Submit Section */}
      <div style={{ marginTop: '24px' }}>
        <p className={commonStyles.vmDescription} style={{ textAlign: 'center' }}>
          Select 3 time slots to meet (EST). You have selected {selectedSlots.length}/3
          slots.
        </p>
        <button
          className={commonStyles.buttonSuccess}
          onClick={handleSubmit}
          disabled={selectedSlots.length !== 3 || isLoading}
        >
          {isLoading
            ? 'Submitting...'
            : isSuggesting
            ? 'Submit Alternative Times'
            : 'Submit Request'}
        </button>
      </div>
    </div>
  );
};

export default BookVirtualMeeting;
