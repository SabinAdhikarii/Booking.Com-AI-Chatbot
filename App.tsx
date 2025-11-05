
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { BookingList } from './components/BookingList';
import { BotIcon, CalendarIcon, ListIcon } from './components/Icons';
import type { ChatMessage, Hotel, Booking, ChatRole, InteractiveAction, FunctionCall, FunctionResponse } from './types';
import { generateContent } from './services/geminiService';
import { MOCK_HOTELS } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: "Hello! I'm your friendly hotel reservation assistant. How can I help you today?" }],
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'chat' | 'admin'>('chat');
  const [interactiveAction, setInteractiveAction] = useState<InteractiveAction | null>(null);

  // Mock Database State
  const [hotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const isProcessing = useRef(false);

  const functionCallHandler = useCallback(async (toolCall: FunctionCall): Promise<FunctionResponse> => {
    const { name, args } = toolCall;
    let result;
    
    switch (name) {
      case 'search_hotels':
        const foundHotels = hotels.filter(h => 
          h.location.toLowerCase() === args.location.toLowerCase() &&
          (args.room_type ? h.room_type.toLowerCase() === args.room_type.toLowerCase() : true) &&
          h.availability
        );
        result = { hotels: foundHotels.map(({ amenities, ...rest }) => rest) }; // Exclude amenities for brevity
        break;
      case 'book_hotel':
        const hotelToBook = hotels.find(h => h.hotel_id === Number(args.hotel_id));
        if (hotelToBook && hotelToBook.availability) {
          const newBooking: Booking = {
            booking_id: `H${Date.now()}`,
            name: args.full_name,
            email: args.email,
            hotel_id: args.hotel_id,
            hotel_name: hotelToBook.hotel_name,
            check_in: args.check_in_date,
            check_out: args.check_out_date,
            guests: args.guests,
            room_type: args.room_type,
            status: 'Confirmed',
          };
          setBookings(prev => [...prev, newBooking]);
          result = { booking: newBooking };
        } else {
          result = { error: "Hotel not found or not available." };
        }
        break;
      case 'get_booking_details':
        const foundBooking = bookings.find(b => b.booking_id === args.booking_id);
        result = foundBooking ? { booking: foundBooking } : { error: "Booking not found." };
        break;
      case 'cancel_booking':
        let cancelled = false;
        setBookings(prev => prev.map(b => {
          if (b.booking_id === args.booking_id) {
            cancelled = true;
            return { ...b, status: 'Cancelled' };
          }
          return b;
        }));
        result = cancelled ? { success: true, booking_id: args.booking_id } : { error: "Booking not found." };
        break;
      default:
        // This case handles the new UI-prompting tools. They don't have a backend implementation.
        // We'll return a generic success to the model so it knows the "tool" was called.
        result = { success: true };
    }
    
    return { name, response: result };
  }, [hotels, bookings]);

  const processConversation = useCallback(async (currentMessages: ChatMessage[]) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setIsLoading(true);

    try {
      const response = await generateContent(currentMessages);
      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        const toolHistory: ChatMessage[] = [{ role: 'model', parts: [{ functionCall: functionCalls[0] }] }];
        let callResult: FunctionResponse | null = null;
        const toolCall = functionCalls[0];

        // Frontend-driving tool calls
        if (['prompt_user_for_choice', 'prompt_user_for_dates', 'prompt_user_for_guests'].includes(toolCall.name)) {
          setInteractiveAction({
            type: toolCall.name as 'prompt_user_for_choice' | 'prompt_user_for_dates' | 'prompt_user_for_guests',
            payload: toolCall.args,
          });
          // Conversation pauses here for user input
          setIsLoading(false);
          isProcessing.current = false;
          return;
        }

        if (toolCall.name === 'display_booking_confirmation') {
            const bookingDetails = toolCall.args.booking as Booking;
            setMessages(prev => [...prev, { role: 'model', parts: [{text: "Great! Here is your booking confirmation."}], bookingDetails }]);
            setIsLoading(false);
            isProcessing.current = false;
            return;
        }

        // Backend-driving tool calls
        callResult = await functionCallHandler(toolCall);
        toolHistory.push({ role: 'tool', parts: [{ functionResponse: callResult }] });
        
        // After a tool call, send the result back to the model to get a natural language response
        processConversation([...currentMessages, ...toolHistory]);

      } else if (response.text) {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.text }] }]);
        setIsLoading(false);
        isProcessing.current = false;
      }

    } catch (error) {
      console.error("Error processing conversation:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] }]);
      setIsLoading(false);
      isProcessing.current = false;
    }
  }, [functionCallHandler]);

  const handleSend = useCallback(async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setUserInput('');
    
    processConversation(newMessages);
  }, [userInput, isLoading, messages, processConversation]);

  const handleInteractiveActionSubmit = (value: string | Record<string, any>) => {
    if (!interactiveAction) return;

    // Format the interactive response as if the user typed it.
    let userTextResponse = '';
    if (interactiveAction.type === 'prompt_user_for_dates') {
      const { startDate, endDate } = value as { startDate: string, endDate: string };
      userTextResponse = `I'd like to book from ${startDate} to ${endDate}.`;
    } else {
      userTextResponse = `I choose: ${value}`;
    }

    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: userTextResponse }] };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInteractiveAction(null);
    processConversation(newMessages);
  };

  useEffect(() => {
    if (view === 'chat' && !isLoading && !interactiveAction) {
        const initialPrompt = messages.length === 1;
        if (initialPrompt) {
            processConversation(messages);
        }
    }
  }, [view, messages, isLoading, interactiveAction, processConversation]);

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <nav className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6">
        <div className="p-2 mb-8 bg-blue-600 rounded-lg">
          <BotIcon className="w-8 h-8 text-white" />
        </div>
        <button 
          onClick={() => setView('chat')}
          className={`p-4 rounded-lg transition-colors duration-200 ${view === 'chat' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Chat"
        >
          <CalendarIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setView('admin')}
          className={`p-4 mt-4 rounded-lg transition-colors duration-200 ${view === 'admin' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Admin View"
        >
          <ListIcon className="w-6 h-6" />
        </button>
      </nav>
      <main className="flex-1 flex flex-col h-screen">
        {view === 'chat' ? (
          <ChatWindow 
            messages={messages}
            userInput={userInput}
            onUserInput={setUserInput}
            onSend={handleSend}
            isLoading={isLoading}
            availableHotels={hotels.filter(h => h.availability)}
            interactiveAction={interactiveAction}
            onInteractiveActionSubmit={handleInteractiveActionSubmit}
          />
        ) : (
          <BookingList bookings={bookings} setBookings={setBookings} />
        )}
      </main>
    </div>
  );
};

export default App;
