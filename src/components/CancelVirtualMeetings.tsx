/**
 * Cancel Virtual Meeting Component
 * Confirmation dialog for canceling an existing meeting
 */

import React, { useState } from 'react';
import { CancelVirtualMeetingsProps } from '../types';
import { formatTimeEST } from '../utils/dateUtils';
import commonStyles from '../styles/VirtualMeetingManager.module.css';

const CancelVirtualMeetings: React.FC<CancelVirtualMeetingsProps> = ({
  meeting,
  participantName,
  listingName,
  onCancel,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel meeting');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={commonStyles.vmHeader}>
        <div className={commonStyles.vmHeaderTitle}>
          <span className={commonStyles.vmIcon}>🗑️</span>
          <h2 className={commonStyles.vmTitle}>Cancel Virtual Meeting?</h2>
        </div>
      </div>

      {error && <div className={commonStyles.error}>{error}</div>}

      <p className={commonStyles.warningText}>This action cannot be undone</p>

      {/* Meeting Info Card */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          background: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span className={commonStyles.vmIcon} style={{ fontSize: '32px' }}>
            📅
          </span>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                margin: '0 0 8px 0',
              }}
            >
              Meeting with {participantName}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0',
              }}
            >
              {listingName}
            </p>
            {meeting.bookedDate && (
              <p
                style={{
                  fontSize: '14px',
                  color: '#7b2cbf',
                  fontWeight: 600,
                  margin: '4px 0',
                }}
              >
                {formatTimeEST(meeting.bookedDate)}
              </p>
            )}
            {meeting.googleMeetLink && (
              <a
                href={meeting.googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginTop: '8px',
                }}
              >
                View Meeting Link
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={commonStyles.buttonGroup}>
        <button
          className={commonStyles.buttonOutline}
          onClick={onClose}
          disabled={isLoading}
        >
          No
        </button>
        <button
          className={commonStyles.buttonDanger}
          onClick={handleCancel}
          disabled={isLoading}
        >
          {isLoading ? 'Canceling...' : 'Cancel Meeting'}
        </button>
      </div>
    </div>
  );
};

export default CancelVirtualMeetings;
