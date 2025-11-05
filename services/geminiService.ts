
import { GoogleGenAI, Type, FunctionDeclaration, Content, GenerateContentResponse } from '@google/genai';
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
You are a friendly and highly skilled hotel reservation assistant for a hotel chain in Nepal. Your goal is to guide the user through the booking process in a step-by-step, conversational manner.

**IMPORTANT**: Do not ask for all information at once. Ask for one piece of information at a time, using the provided tools to get the user's input.

Your capabilities are:
1.  **Guiding User Input**: Use the 'prompt_user_for_...' tools to ask the user for choices, dates, or numbers.
2.  **Searching Hotels**: Once you have the location, use the 'search_hotels' tool.
3.  **Booking a Room**: Once all details are gathered, use the 'book_hotel' tool.
4.  **Confirming a Booking**: After a successful booking, use the 'display_booking_confirmation' tool to show the user a receipt.
5.  **Viewing/Cancelling**: You can also view or cancel bookings with an ID.

**Conversation Flow Example**:
1.  Start by greeting the user.
2.  Ask what they want to do. If they want to book a hotel, first ask for the city. Use \`prompt_user_for_choice\` with a list of available cities: Pokhara, Kathmandu, Chitwan, Butwal.
3.  Once the user selects a city, ask for the room type. Use \`prompt_user_for_choice\` with options: Standard, Deluxe, Suite.
4.  Then, use \`search_hotels\` with the collected location and room type.
5.  Present the search results to the user in a readable list.
6.  If they choose a hotel, ask for check-in and check-out dates using \`prompt_user_for_dates\`.
7.  Then ask for the number of guests using \`prompt_user_for_guests\`.
8.  Then ask for their full name and email in a single message (plain text).
9.  After you have all details (hotel_id, dates, guests, name, email, room_type), call \`book_hotel\`.
10. Finally, use the response from \`book_hotel\` to call \`display_booking_confirmation\`.

- Never reveal function names. Maintain a conversational tone.
- Do not just output raw JSON. Summarize tool results for the user.
`;


const tools: FunctionDeclaration[] = [
  // Backend Tools
  {
    name: 'search_hotels',
    description: 'Searches for available hotels based on location and optionally room type.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: {
          type: Type.STRING,
          description: 'The city where the user wants to find a hotel (e.g., Pokhara, Kathmandu).',
        },
        room_type: {
            type: Type.STRING,
            description: 'The type of room the user prefers (e.g., Standard, Deluxe, Suite).',
        }
      },
      required: ['location'],
    },
  },
  {
    name: 'book_hotel',
    description: 'Books a hotel room for a user.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        hotel_id: { type: Type.NUMBER, description: 'The ID of the hotel to book.' },
        full_name: { type: Type.STRING, description: "The user's full name." },
        email: { type: Type.STRING, description: "The user's email address." },
        check_in_date: { type: Type.STRING, description: 'The check-in date (YYYY-MM-DD).' },
        check_out_date: { type: Type.STRING, description: 'The check-out date (YYYY-MM-DD).' },
        guests: { type: Type.NUMBER, description: 'The number of guests.' },
        room_type: { type: Type.STRING, description: 'The room type being booked.' },
      },
      required: ['hotel_id', 'full_name', 'email', 'check_in_date', 'check_out_date', 'guests', 'room_type'],
    },
  },
  {
    name: 'get_booking_details',
    description: 'Retrieves the details of a specific booking by its ID.',
    parameters: {
      type: Type.OBJECT, properties: { booking_id: { type: Type.STRING } }, required: ['booking_id'],
    },
  },
  {
    name: 'cancel_booking',
    description: 'Cancels an existing booking by its ID.',
    parameters: {
      type: Type.OBJECT, properties: { booking_id: { type: Type.STRING } }, required: ['booking_id'],
    },
  },
  // Frontend / UI Tools
  {
    name: 'prompt_user_for_choice',
    description: "Asks the user to select one option from a list. Use this for things like city or room type.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            label: { type: Type.STRING, description: "The question to ask the user (e.g., 'Which city would you like to stay in?')." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of options for the user to choose from." },
        },
        required: ['label', 'options'],
    },
  },
  {
    name: 'prompt_user_for_dates',
    description: "Asks the user to select a check-in and check-out date using a calendar.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            label: { type: Type.STRING, description: "The prompt for the user (e.g., 'Please select your check-in and check-out dates.')." },
        },
        required: ['label'],
    }
  },
  {
    name: 'prompt_user_for_guests',
    description: "Asks the user to specify the number of guests.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            label: { type: Type.STRING, description: "The prompt for the user (e.g., 'How many guests will be staying?')." },
        },
        required: ['label'],
    }
  },
  {
    name: 'display_booking_confirmation',
    description: 'Shows a visual confirmation receipt to the user after a successful booking.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            booking: {
                type: Type.OBJECT,
                description: 'The full booking object containing all details.',
                properties: {
                    booking_id: { type: Type.STRING },
                    hotel_name: { type: Type.STRING },
                    check_in: { type: Type.STRING },
                    check_out: { type: Type.STRING },
                    guests: { type: Type.NUMBER },
                    name: { type: Type.STRING },
                    email: { type: Type.STRING },
                    room_type: { type: Type.STRING },
                }
            }
        },
        required: ['booking']
    }
  }
];


export async function generateContent(history: ChatMessage[]): Promise<GenerateContentResponse> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: history as Content[],
        config: {
            systemInstruction,
            tools: [{ functionDeclarations: tools }],
        }
    });
    return response;
}
