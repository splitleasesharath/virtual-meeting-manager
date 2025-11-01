/**
 * Virtual Meeting Manager - Main Export File
 * Export all components, types, services, and utilities
 */

// Main Component
export { default as VirtualMeetingManager } from './components/VirtualMeetingManager';

// Subcomponents
export { default as RespondToVMRequest } from './components/RespondToVMRequest';
export { default as BookVirtualMeeting } from './components/BookVirtualMeeting';
export { default as CancelVirtualMeetings } from './components/CancelVirtualMeetings';
export { default as DetailsOfProposalAndVM } from './components/DetailsOfProposalAndVM';
export { default as BookTimeSlot } from './components/BookTimeSlot';

// Types
export * from './types';

// Services
export { default as virtualMeetingService } from './services/virtualMeetingAPI';
export * from './services/virtualMeetingAPI';

// Utilities
export * from './utils/dateUtils';
