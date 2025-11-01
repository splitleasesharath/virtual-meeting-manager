/**
 * Date and Timezone Utility Functions
 * Handles EST timezone conversions and date formatting
 */

import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export const EST_TIMEZONE = 'America/New_York';

/**
 * Convert a date to UTC from EST timezone
 */
export const toUTC = (estDate: Date): Date => {
  return zonedTimeToUtc(estDate, EST_TIMEZONE);
};

/**
 * Convert a UTC date to EST timezone
 */
export const toEST = (utcDate: Date): Date => {
  return utcToZonedTime(utcDate, EST_TIMEZONE);
};

/**
 * Format a date in EST timezone
 * @param date - Date to format
 * @param formatString - Format string (default: 'MMM d, yyyy h:mm a')
 */
export const formatTimeEST = (date: Date, formatString: string = 'MMM d, yyyy h:mm a'): string => {
  const estDate = toEST(date);
  return format(estDate, formatString) + ' (EST)';
};

/**
 * Format time only in EST
 */
export const formatTimeOnlyEST = (date: Date): string => {
  const estDate = toEST(date);
  return format(estDate, 'h:mm a') + ' (EST)';
};

/**
 * Format date only in EST
 */
export const formatDateOnlyEST = (date: Date): string => {
  const estDate = toEST(date);
  return format(estDate, 'MMM d, yyyy');
};

/**
 * Generate time slots for a given day
 * @param date - Base date for time slots
 * @param startHour - Starting hour (24-hour format, default: 8)
 * @param endHour - Ending hour (24-hour format, default: 20)
 * @param interval - Interval in minutes (default: 30)
 */
export const generateTimeSlots = (
  date: Date,
  startHour: number = 8,
  endHour: number = 20,
  interval: number = 30
): Date[] => {
  const slots: Date[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      slots.push(slotTime);
    }
  }

  return slots;
};

/**
 * Generate calendar days for a month
 */
export const generateCalendarDays = (currentMonth: Date): (Date | null)[] => {
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayOfWeek = getDay(firstDayOfMonth);

  const days: (Date | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  }

  return days;
};

/**
 * Navigate to previous month
 */
export const getPreviousMonth = (currentMonth: Date): Date => {
  return subMonths(currentMonth, 1);
};

/**
 * Navigate to next month
 */
export const getNextMonth = (currentMonth: Date): Date => {
  return addMonths(currentMonth, 1);
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const now = new Date();
  return date < now;
};

/**
 * Check if two dates are the same (ignoring time)
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Check if two dates and times are the same
 */
export const isSameDateTime = (date1: Date, date2: Date): boolean => {
  return date1.getTime() === date2.getTime();
};

/**
 * Convert Date to ISO string for API requests
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse ISO string to Date
 */
export const fromISOString = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Generate Google Calendar URL
 * @param meeting - Virtual meeting details
 * @param proposal - Proposal details
 */
export const generateGoogleCalendarUrl = (
  meeting: { bookedDate?: Date; googleMeetLink?: string },
  proposal: { guest: { firstName: string }; listing: { name: string } }
): string => {
  if (!meeting.bookedDate) return '';

  const startDate = toEST(meeting.bookedDate);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1); // 1 hour meeting

  const formatForGoogle = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const title = encodeURIComponent(`Virtual Meeting - ${proposal.listing.name}`);
  const details = encodeURIComponent(
    `Virtual meeting with ${proposal.guest.firstName}\n${meeting.googleMeetLink || ''}`
  );
  const dates = `${formatForGoogle(startDate)}/${formatForGoogle(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}&ctz=${EST_TIMEZONE}`;
};

/**
 * Get month names array
 */
export const getMonthNames = (): string[] => {
  return Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), 'MMMM'));
};

/**
 * Get day names array
 */
export const getDayNames = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};
