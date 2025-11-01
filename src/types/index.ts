/**
 * TypeScript Type Definitions for Virtual Meeting Manager
 * Based on Bubble.io data structures
 */

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  profilePhoto?: string;
  typeUserSignup: 'host' | 'guest';
  notificationSetting?: NotificationSetting;
}

export interface NotificationSetting {
  virtualMeetings: ('email' | 'sms' | 'in-app')[];
}

export interface Listing {
  id: string;
  name: string;
  virtualMeetingRequest?: VirtualMeetingSchedule;
}

export interface Proposal {
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

export interface VirtualMeetingSchedule {
  id: string;
  proposalId: string;
  proposedTimes: Date[];
  bookedDate?: Date;
  googleMeetLink?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  confirmedBySplitLease?: boolean;
  name?: string;
}

export interface Link {
  id: string;
  name: string;
  url: string;
}

export type ViewState = 'respond' | 'request' | 'cancel' | 'details' | '';

export interface VirtualMeetingManagerProps {
  proposal: Proposal;
  initialView?: ViewState;
  onClose: () => void;
  currentUser: User;
}

export interface RespondToVMRequestProps {
  proposal: Proposal;
  onConfirm: (selectedTime: Date) => Promise<void>;
  onDecline: () => Promise<void>;
  onSuggestAlt: () => void;
}

export interface BookVirtualMeetingProps {
  proposal: Proposal;
  isSuggesting: boolean;
  onSubmit: (slots: Date[], isSuggesting: boolean) => Promise<void>;
  onBack: () => void;
  currentUser: User;
}

export interface CancelVirtualMeetingsProps {
  meeting: VirtualMeetingSchedule;
  participantName: string;
  listingName: string;
  onCancel: () => Promise<void>;
  onClose: () => void;
}

export interface DetailsOfProposalAndVMProps {
  proposal: Proposal;
  meeting: VirtualMeetingSchedule;
  onClose: () => void;
}

export interface BookTimeSlotProps {
  initialStartTime?: number;
  initialEndTime?: number;
  interval?: number;
  maxSelections?: number;
  onSelectionChange?: (slots: Date[]) => void;
  timezone?: string;
  disabledDates?: Date[];
  selectedSlots?: Date[];
}

export interface BookTimeSlotState {
  clearTimeSlots: boolean;
  timesSelected: Date[];
  endTime: number;
  internalEditing: boolean;
  interval: number;
  lastLogicalDate: Date | null;
  requestingCoh: boolean;
  startTime: number;
}

// API Request/Response types
export interface AcceptMeetingRequest {
  proposal: string;
  booked_date_sel: string;
  user_accepting: string;
}

export interface CreateMeetingRequest {
  proposal: string;
  times_selected: string[];
  requested_by: string;
  is_alternative_times: boolean;
  timezone_string: string;
}

export interface UploadVideoRequest {
  video_file: File;
  listing: string;
  guest: string;
}

export interface NotifyParticipantsRequest {
  host: string;
  guest: string;
  virtual_meeting: string;
}

export interface GoogleCalendarRequest {
  proposal: string;
  user: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}
