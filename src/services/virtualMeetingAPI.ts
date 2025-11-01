/**
 * Virtual Meeting API Service Layer
 * Handles all backend workflow API calls
 */

import {
  AcceptMeetingRequest,
  CreateMeetingRequest,
  UploadVideoRequest,
  NotifyParticipantsRequest,
  GoogleCalendarRequest,
  ApiResponse,
} from '../types';
import { toISOString } from '../utils/dateUtils';

// Configure your Bubble app domain here
const BUBBLE_API_BASE = process.env.REACT_APP_BUBBLE_API_BASE || 'https://your-app.bubbleapps.io/api/1.1/wf';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T = any>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BUBBLE_API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * WORKFLOW 1: Accept Virtual Meeting
 * Accepts a virtual meeting request, updates schedules, sends notifications
 */
export async function acceptVirtualMeeting(
  proposalId: string,
  bookedDate: Date,
  userAcceptingId: string
): Promise<ApiResponse> {
  const data: AcceptMeetingRequest = {
    proposal: proposalId,
    booked_date_sel: toISOString(bookedDate),
    user_accepting: userAcceptingId,
  };

  return apiRequest('accept-virtual-meeting', data);
}

/**
 * WORKFLOW 2: Upload Virtual Meeting Video
 * Uploads a video for a virtual meeting request
 */
export async function uploadVirtualMeetingVideo(
  videoFile: File,
  listingId: string,
  guestId: string
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('video_file', videoFile);
  formData.append('listing', listingId);
  formData.append('guest', guestId);

  try {
    const response = await fetch(`${BUBBLE_API_BASE}/upload_video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Video upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    console.error('Video Upload Error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Video upload failed',
    };
  }
}

/**
 * WORKFLOW 3: Create Virtual Meeting Request
 * Creates a new virtual meeting request with proposed time slots
 */
export async function createVirtualMeetingRequest(
  proposalId: string,
  timesSelected: Date[],
  requestedById: string,
  isAlternativeTimes: boolean = false,
  timezoneString: string = 'America/New_York'
): Promise<ApiResponse> {
  const data: CreateMeetingRequest = {
    proposal: proposalId,
    times_selected: timesSelected.map(toISOString),
    requested_by: requestedById,
    is_alternative_times: isAlternativeTimes,
    timezone_string: timezoneString,
  };

  return apiRequest('CORE-create-virtual-meeting', data);
}

/**
 * WORKFLOW 4: Notify Participants of Confirmed Virtual Meeting
 * Sends notifications (email and SMS) to both host and guest
 */
export async function notifyVirtualMeetingParticipants(
  hostId: string,
  guestId: string,
  virtualMeetingId: string
): Promise<ApiResponse> {
  const data: NotifyParticipantsRequest = {
    host: hostId,
    guest: guestId,
    virtual_meeting: virtualMeetingId,
  };

  return apiRequest('notify-virtual-meeting-partici', data);
}

/**
 * WORKFLOW 5: Trigger Google Calendar Integration
 * Triggers Google Calendar via Zapier to send calendar invites
 */
export async function sendGoogleCalendarInvite(
  proposalId: string,
  userId: string
): Promise<ApiResponse> {
  const data: GoogleCalendarRequest = {
    proposal: proposalId,
    user: userId,
  };

  return apiRequest('l3-trigger-send-google-calend', data);
}

/**
 * Decline a virtual meeting request
 */
export async function declineVirtualMeeting(proposalId: string): Promise<ApiResponse> {
  // This would call a decline workflow if it exists in your Bubble app
  // Adjust endpoint name as needed
  return apiRequest('decline-virtual-meeting', { proposal: proposalId });
}

/**
 * Cancel an existing virtual meeting
 */
export async function cancelVirtualMeeting(
  meetingId: string,
  proposalId: string
): Promise<ApiResponse> {
  return apiRequest('cancel-virtual-meeting', {
    meeting_id: meetingId,
    proposal: proposalId,
  });
}

/**
 * Fetch proposal details with virtual meeting information
 */
export async function fetchProposalDetails(proposalId: string): Promise<ApiResponse> {
  try {
    // Adjust to your Bubble API data endpoint structure
    const response = await fetch(
      `${BUBBLE_API_BASE.replace('/wf', '')}/obj/proposal/${proposalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch proposal: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      status: 'success',
      data: result.response,
    };
  } catch (error) {
    console.error('Fetch Proposal Error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch proposal',
    };
  }
}

/**
 * Retry logic wrapper for API calls
 */
export async function retryApiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T> | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await apiFunction();

    if (result.status === 'success') {
      return result;
    }

    lastError = result;

    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  return lastError || { status: 'error', message: 'All retry attempts failed' };
}

// Export all API functions as a service object
export const virtualMeetingService = {
  acceptMeeting: acceptVirtualMeeting,
  uploadVideo: uploadVirtualMeetingVideo,
  createRequest: createVirtualMeetingRequest,
  notifyParticipants: notifyVirtualMeetingParticipants,
  sendGoogleCalendar: sendGoogleCalendarInvite,
  declineMeeting: declineVirtualMeeting,
  cancelMeeting: cancelVirtualMeeting,
  fetchProposal: fetchProposalDetails,
  retry: retryApiCall,
};

export default virtualMeetingService;
