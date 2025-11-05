
import React from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, isLoading }) => {
  const isUser = message.role === 'user';

  const textContent = message.parts.map(part => part.text).join('');

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <BotIcon className="w-6 h-6" />
        </div>
      )}
      <div
        className={`max-w-xl px-4 py-3 rounded-2xl shadow ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{textContent}</p>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
          <UserIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
