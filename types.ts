
export interface Hotel {
  hotel_id: number;
  hotel_name: string;
  location: string;
  price_per_night: number;
  room_type: 'Deluxe' | 'Suite' | 'Standard';
  availability: boolean;
  image_url: string;
  amenities: string[];
}

export interface Booking {
  booking_id: string;
  name: string;
  email: string;
  hotel_id: number;
  hotel_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  room_type: 'Deluxe' | 'Suite' | 'Standard';
  status: 'Confirmed' | 'Cancelled';
}

export type ChatRole = 'user' | 'model' | 'tool';

export interface FunctionCall {
    name: string;
    args: Record<string, any>;
}

export interface FunctionResponse {
    name: string;
    response: Record<string, any>;
}
export interface ChatPart {
  text?: string;
  functionCall?: FunctionCall;
  functionResponse?: FunctionResponse;
}

export interface ChatMessage {
  role: ChatRole;
  parts: ChatPart[];
  bookingDetails?: Booking;
}

export type InteractiveAction = {
    type: 'prompt_user_for_choice' | 'prompt_user_for_dates' | 'prompt_user_for_guests';
    payload: {
        label?: string;
        options?: string[];
    };
} | null;
