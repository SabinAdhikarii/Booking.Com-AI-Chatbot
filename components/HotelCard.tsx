
import React from 'react';
import type { Hotel } from '../types';
import { StarIcon } from './Icons';

interface HotelCardProps {
  hotel: Hotel;
}

const roomTypeColors = {
    Standard: 'bg-blue-100 text-blue-800',
    Deluxe: 'bg-purple-100 text-purple-800',
    Suite: 'bg-green-100 text-green-800',
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl">
      <img src={hotel.image_url} alt={hotel.hotel_name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{hotel.hotel_name} (ID: {hotel.hotel_id})</h3>
            <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full ${roomTypeColors[hotel.room_type]}`}>{hotel.room_type}</span>
        </div>
        <p className="text-sm text-gray-600">{hotel.location}</p>
        <div className="flex items-center mt-2">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <StarIcon className="w-5 h-5 text-gray-300" />
        </div>
        <p className="text-xs text-gray-500 mt-2 truncate">{hotel.amenities.join(', ')}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-semibold text-blue-600">${hotel.price_per_night}</p>
          <span className="text-sm text-gray-500">/ night</span>
        </div>
      </div>
    </div>
  );
};
