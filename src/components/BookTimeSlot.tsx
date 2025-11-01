/**
 * Book Time Slot Calendar Component
 * Allows users to select up to 3 time slots from a calendar in EST timezone
 */

import React, { useState, useEffect } from 'react';
import {
  generateTimeSlots,
  generateCalendarDays,
  getPreviousMonth,
  getNextMonth,
  formatTimeEST,
  getMonthNames,
  getDayNames,
  isPastDate,
  isSameDateTime,
} from '../utils/dateUtils';
import { BookTimeSlotProps, BookTimeSlotState } from '../types';
import styles from '../styles/BookTimeSlot.module.css';

const BookTimeSlot: React.FC<BookTimeSlotProps> = ({
  initialStartTime = 8,
  initialEndTime = 20,
  interval = 30,
  maxSelections = 3,
  onSelectionChange,
  timezone = 'America/New_York',
  disabledDates = [],
  selectedSlots = [],
}) => {
  const [state, setState] = useState<BookTimeSlotState>({
    clearTimeSlots: false,
    timesSelected: selectedSlots,
    endTime: initialEndTime,
    internalEditing: false,
    interval: interval,
    lastLogicalDate: null,
    requestingCoh: false,
    startTime: initialStartTime,
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(state.timesSelected);
    }
  }, [state.timesSelected, onSelectionChange]);

  // Handle date selection (opens time picker)
  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    if (state.timesSelected.length >= maxSelections) return;

    setSelectedDate(date);
    const slots = generateTimeSlots(date, state.startTime, state.endTime, state.interval);
    setAvailableTimeSlots(slots);
    setShowTimePicker(true);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: Date) => {
    const alreadySelected = state.timesSelected.some((slot) =>
      isSameDateTime(slot, timeSlot)
    );

    if (!alreadySelected && state.timesSelected.length < maxSelections) {
      setState((prev) => ({
        ...prev,
        timesSelected: [...prev.timesSelected, timeSlot],
        internalEditing: true,
        lastLogicalDate: timeSlot,
      }));
    }

    setShowTimePicker(false);
    setSelectedDate(null);
  };

  // Remove a selected slot
  const handleRemoveSlot = (index: number) => {
    setState((prev) => ({
      ...prev,
      timesSelected: prev.timesSelected.filter((_, i) => i !== index),
    }));
  };

  // Clear all selections
  const handleClearTimeSlots = () => {
    setState((prev) => ({
      ...prev,
      timesSelected: [],
      clearTimeSlots: false,
      internalEditing: false,
    }));
  };

  // Month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  };

  const goToNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date): boolean => {
    if (isPastDate(date)) return true;
    return disabledDates.some((disabledDate) =>
      isSameDateTime(date, disabledDate)
    );
  };

  return (
    <div className={styles.bookTimeSlotContainer}>
      {/* Calendar Section */}
      <div className={styles.selectDateSection}>
        <div className={styles.calendarHeader}>
          <button onClick={goToPreviousMonth} aria-label="Previous month">
            ←
          </button>
          <select
            value={currentMonth.getMonth()}
            onChange={(e) =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1)
              )
            }
            aria-label="Select month"
          >
            {getMonthNames().map((month, i) => (
              <option key={i} value={i}>
                {month}
              </option>
            ))}
          </select>
          <button onClick={goToNextMonth} aria-label="Next month">
            →
          </button>
        </div>

        <div className={styles.daysOfWeek}>
          {getDayNames().map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {generateCalendarDays(currentMonth).map((date, index) => (
            <div key={index} className={styles.calendarCell}>
              {date && (
                <button
                  onClick={() => handleDateSelect(date)}
                  disabled={isDateDisabled(date)}
                  className={styles.dateButton}
                  aria-label={`Select ${date.toDateString()}`}
                >
                  {date.getDate()}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Slot Selection Section */}
      <div className={styles.selectTimeSection}>
        <h3>Select {maxSelections} Time Slots (EST)</h3>

        {/* Selected slots display */}
        <div className={styles.selectedSlots}>
          {state.timesSelected.length === 0 ? (
            <div className={styles.emptySlots}>
              Click on a date to select time slots
            </div>
          ) : (
            state.timesSelected.map((slot, index) => (
              <div key={index} className={styles.slotBadge}>
                {formatTimeEST(slot, 'MMM d, h:mm a')}
                <button
                  className={styles.removeSlotBtn}
                  onClick={() => handleRemoveSlot(index)}
                  aria-label="Remove time slot"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear button */}
        <button
          onClick={handleClearTimeSlots}
          disabled={state.timesSelected.length === 0}
          className={styles.clearButton}
        >
          Clear Time Slots
        </button>

        {/* Current date info */}
        <div className={styles.currentDateInfo}>
          Select {maxSelections - state.timesSelected.length} more time slot
          {maxSelections - state.timesSelected.length !== 1 ? 's' : ''} (EST)
        </div>
      </div>

      {/* Time Picker Modal */}
      {showTimePicker && selectedDate && (
        <>
          <div
            className={styles.dialogOverlay}
            onClick={() => setShowTimePicker(false)}
          />
          <div className={styles.timePickerModal}>
            <h3 className={styles.timePickerHeader}>
              Select Time for {selectedDate.toLocaleDateString()}
            </h3>
            <div className={styles.timeSlotsList}>
              {availableTimeSlots.map((timeSlot, index) => {
                const isDisabled =
                  isPastDate(timeSlot) ||
                  state.timesSelected.some((slot) =>
                    isSameDateTime(slot, timeSlot)
                  );

                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotSelect(timeSlot)}
                    disabled={isDisabled}
                    className={styles.timeSlotButton}
                  >
                    {formatTimeEST(timeSlot, 'h:mm a')}
                  </button>
                );
              })}
            </div>
            <button
              className={styles.clearButton}
              onClick={() => setShowTimePicker(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookTimeSlot;
