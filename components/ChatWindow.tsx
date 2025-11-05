
import React, { useRef, useEffect } from 'react';
import type { ChatMessage, Hotel, InteractiveAction } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';
import { HotelCard } from './HotelCard';
import { SendIcon } from './Icons';
import { BookingReceipt } from './BookingReceipt';
import { InteractivePrompts } from './InteractivePrompts';


interface ChatWindowProps {
  messages: ChatMessage[];
  userInput: string;
  onUserInput: (input: string) => void;
  onSend: () => void;
  isLoading: boolean;
  availableHotels: Hotel[];
  interactiveAction: InteractiveAction | null;
  onInteractiveActionSubmit: (value: string | Record<string, any>) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  userInput,
  onUserInput,
  onSend,
  isLoading,
  availableHotels,
  interactiveAction,
  onInteractiveActionSubmit,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, interactiveAction]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSend();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel Reservation Chatbot</h1>
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto space-y-4 pr-4 bg-white p-4 rounded-lg shadow-inner"
        >
          {messages.map((msg, index) => 
             msg.bookingDetails ? (
                <BookingReceipt key={index} booking={msg.bookingDetails} />
             ) : (
                <ChatMessageBubble key={index} message={msg} />
             )
          )}
          {isLoading && !interactiveAction && <ChatMessageBubble message={{ role: 'model', parts: [{ text: '...' }] }} isLoading={true} />}
        </div>
        <div className="mt-6">
            {interactiveAction ? (
                <InteractivePrompts 
                    action={interactiveAction}
                    onSubmit={onInteractiveActionSubmit}
                />
            ) : (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => onUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask to book a hotel..."
                        className="w-full py-3 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        disabled={isLoading}
                    />
                    <button
                        onClick={onSend}
                        disabled={isLoading || !userInput.trim()}
                        className="ml-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
      </div>
      <aside className="w-1/3 bg-white border-l border-gray-200 p-6 overflow-y-auto hidden lg:block">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Hotels</h2>
        <div className="space-y-4">
          {availableHotels.map(hotel => (
            <HotelCard key={hotel.hotel_id} hotel={hotel} />
          ))}
        </div>
      </aside>
    </div>
  );
};
