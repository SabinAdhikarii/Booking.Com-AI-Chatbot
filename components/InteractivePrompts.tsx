
import React, { useState } from 'react';
import type { InteractiveAction } from '../types';

interface InteractivePromptsProps {
  action: NonNullable<InteractiveAction>;
  onSubmit: (value: any) => void;
}

export const InteractivePrompts: React.FC<InteractivePromptsProps> = ({ action, onSubmit }) => {
  const { type, payload } = action;

  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  const renderContent = () => {
    switch (type) {
      case 'prompt_user_for_choice':
        return (
          <div>
            <p className="font-semibold mb-3 text-gray-700">{payload.label}</p>
            <div className="flex flex-wrap gap-2">
              {payload.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => onSubmit(option)}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'prompt_user_for_dates':
        return (
            <div>
                <p className="font-semibold mb-3 text-gray-700">{payload.label}</p>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-600">Check-in</label>
                        <input
                            type="date"
                            id="start-date"
                            value={dates.startDate}
                            onChange={(e) => setDates(d => ({ ...d, startDate: e.target.value }))}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-600">Check-out</label>
                        <input
                            type="date"
                            id="end-date"
                            value={dates.endDate}
                            onChange={(e) => setDates(d => ({ ...d, endDate: e.target.value }))}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => onSubmit(dates)}
                        disabled={!dates.startDate || !dates.endDate}
                        className="self-end px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
                    >
                        Confirm Dates
                    </button>
                </div>
            </div>
        );
      case 'prompt_user_for_guests':
        return (
            <div>
                 <p className="font-semibold mb-3 text-gray-700">{payload.label}</p>
                 <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                         <button
                            key={num}
                            onClick={() => onSubmit(String(num))}
                            className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                            {num}
                        </button>
                    ))}
                 </div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg animate-fade-in-up">
      {renderContent()}
    </div>
  );
};
