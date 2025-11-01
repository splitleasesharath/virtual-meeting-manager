/**
 * Details of Proposal and VM Component
 * Displays confirmed meeting details with Google Calendar integration
 */

import React from 'react';
import { DetailsOfProposalAndVMProps } from '../types';
import { formatTimeEST, generateGoogleCalendarUrl } from '../utils/dateUtils';
import commonStyles from '../styles/VirtualMeetingManager.module.css';

const DetailsOfProposalAndVM: React.FC<DetailsOfProposalAndVMProps> = ({
  proposal,
  meeting,
  onClose,
}) => {
  const handleAddToCalendar = () => {
    const url = generateGoogleCalendarUrl(meeting, proposal);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div>
      {/* Header with Close Button */}
      <div className={commonStyles.vmHeader}>
        <div className={commonStyles.vmHeaderTitle}>
          <h2 className={commonStyles.vmTitle}>Virtual Meeting Details</h2>
        </div>
        <button className={commonStyles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      {/* Guest Profile Photo */}
      {proposal.guest.profilePhoto && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src={proposal.guest.profilePhoto}
            alt={proposal.guest.firstName}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #7b2cbf',
            }}
          />
        </div>
      )}

      {/* Booked Date Section */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#6b7280',
            margin: '0 0 8px 0',
          }}
        >
          Booked for:
        </h2>
        {meeting.bookedDate && (
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#7b2cbf',
              margin: '0',
            }}
          >
            {formatTimeEST(meeting.bookedDate, 'EEEE, MMMM d, yyyy')}
            <br />
            {formatTimeEST(meeting.bookedDate, 'h:mm a')}
          </h1>
        )}
      </div>

      {/* Meeting Details List */}
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '12px 16px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <dt
          style={{
            fontWeight: 600,
            color: '#374151',
            fontSize: '14px',
          }}
        >
          Guest:
        </dt>
        <dd
          style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          {proposal.guest.firstName} {proposal.guest.name}
        </dd>

        <dt
          style={{
            fontWeight: 600,
            color: '#374151',
            fontSize: '14px',
          }}
        >
          Listing:
        </dt>
        <dd
          style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          {proposal.listing.name}
        </dd>

        {proposal.nights && proposal.nights.length > 0 && (
          <>
            <dt
              style={{
                fontWeight: 600,
                color: '#374151',
                fontSize: '14px',
              }}
            >
              Weekly Schedule:
            </dt>
            <dd
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '14px',
              }}
            >
              {proposal.nights.join(', ')}
            </dd>
          </>
        )}

        {proposal.reservationSpan && (
          <>
            <dt
              style={{
                fontWeight: 600,
                color: '#374151',
                fontSize: '14px',
              }}
            >
              Reservation Span:
            </dt>
            <dd
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '14px',
              }}
            >
              {proposal.reservationSpan} week{proposal.reservationSpan !== 1 ? 's' : ''}
            </dd>
          </>
        )}
      </dl>

      {/* Google Calendar Button */}
      <button
        onClick={handleAddToCalendar}
        style={{
          width: '100%',
          padding: '14px 20px',
          background: 'white',
          border: '2px solid #7b2cbf',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#7b2cbf',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.2s',
          marginBottom: '12px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f5f3ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"
            fill="#7b2cbf"
          />
        </svg>
        Click to add this meeting to your calendar
      </button>

      {/* Google Meet Link */}
      {meeting.googleMeetLink && (
        <a
          href={meeting.googleMeetLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            fontSize: '14px',
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#3b82f6';
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" />
          </svg>
          Google Meets Link
        </a>
      )}
    </div>
  );
};

export default DetailsOfProposalAndVM;
