
import React from 'react';
import type { Booking } from '../types';
import { BotIcon, CheckCircleIcon, UserIcon } from './Icons';

interface BookingReceiptProps {
  booking: Booking;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-200">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 text-right">{value}</span>
  </div>
);

export const BookingReceipt: React.FC<BookingReceiptProps> = ({ booking }) => {
  return (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <BotIcon className="w-6 h-6" />
        </div>
        <div className="max-w-md bg-white rounded-2xl rounded-bl-none shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-4">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-xl font-bold text-gray-900 mt-2">Booking Confirmed!</h2>
                <p className="text-sm text-gray-500">Your reservation is complete.</p>
            </div>
            
            <div className="space-y-1 mb-4">
                <DetailRow label="Booking ID" value={booking.booking_id} />
                <DetailRow label="Hotel" value={booking.hotel_name} />
                <DetailRow label="Room Type" value={booking.room_type} />
                <DetailRow label="Check-in" value={booking.check_in} />
                <DetailRow label="Check-out" value={booking.check_out} />
                <DetailRow label="Guests" value={String(booking.guests)} />
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Guest Information</h3>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{booking.name}</p>
                        <p className="text-sm text-gray-600">{booking.email}</p>
                    </div>
                </div>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-6">A confirmation email has been sent. Thank you for booking with us!</p>
        </div>
    </div>
  );
};
