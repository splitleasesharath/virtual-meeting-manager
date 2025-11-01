/**
 * Respond to VM Request Component
 * Allows users to respond to meeting requests by selecting a proposed time or declining
 */

import React, { useState } from 'react';
import { RespondToVMRequestProps } from '../types';
import { formatTimeEST } from '../utils/dateUtils';
import commonStyles from '../styles/VirtualMeetingManager.module.css';
import styles from '../styles/RespondToVMRequest.module.css';

const RespondToVMRequest: React.FC<RespondToVMRequestProps> = ({
  proposal,
  onConfirm,
  onDecline,
  onSuggestAlt,
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTimeSelection = (time: Date) => {
    setSelectedTime(time);
    setShowConfirmation(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectedTime) return;

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(selectedTime);
      setShowConfirmation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm meeting');
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onDecline();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline meeting');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={commonStyles.vmHeader}>
        <div className={commonStyles.vmHeaderTitle}>
          <span className={commonStyles.vmIcon}>📅</span>
          <h2 className={commonStyles.vmTitle}>Virtual Meeting Response</h2>
        </div>
      </div>

      {error && <div className={commonStyles.error}>{error}</div>}

      <p className={commonStyles.vmDescription}>
        Select one of the available dates proposed by {proposal.host.name} for{' '}
        {proposal.guest.firstName} below. All times are in EST timezone.
      </p>

      <div className={commonStyles.timeSlots}>
        {proposal.availableTimes && proposal.availableTimes.length > 0 ? (
          proposal.availableTimes.map((time, index) => (
            <label key={index} className={commonStyles.timeSlotOption}>
              <input
                type="radio"
                name="timeSlot"
                value={time.toString()}
                checked={selectedTime?.getTime() === time.getTime()}
                onChange={() => handleTimeSelection(time)}
                disabled={isLoading}
              />
              <span>{formatTimeEST(time)}</span>
            </label>
          ))
        ) : (
          <p className={commonStyles.vmDescription}>
            No time slots available. Please suggest alternative times.
          </p>
        )}
      </div>

      <div className={styles.alternativeSection}>
        <div className={commonStyles.infoBox}>
          <p>
            If none of the times work for you, you may submit alternative times for
            the host to choose from.
          </p>
        </div>

        <div className={commonStyles.buttonGroup}>
          <button
            className={commonStyles.buttonDecline}
            onClick={handleDecline}
            disabled={isLoading}
          >
            Decline
          </button>
          <button
            className={commonStyles.buttonPrimary}
            onClick={onSuggestAlt}
            disabled={isLoading}
          >
            Suggest Alternative Times
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedTime && (
        <>
          <div
            className={styles.dialogOverlay}
            onClick={() => !isLoading && setShowConfirmation(false)}
          />
          <div className={styles.confirmDialog}>
            <p className={styles.confirmMessage}>
              Are you sure you want this time slot?
            </p>
            <p className={styles.confirmTimeSlot}>{formatTimeEST(selectedTime)}</p>

            <div className={styles.dialogButtons}>
              <button
                className={commonStyles.buttonOutline}
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className={commonStyles.buttonPrimary}
                onClick={handleConfirmSelection}
                disabled={isLoading}
              >
                {isLoading ? 'Confirming...' : 'Yes'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RespondToVMRequest;
