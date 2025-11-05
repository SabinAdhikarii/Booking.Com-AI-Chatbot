
import React from 'react';
import type { Booking } from '../types';
import { TrashIcon } from './Icons';

interface BookingListProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, setBookings }) => {

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => 
      b.booking_id === bookingId ? { ...b, status: 'Cancelled' } : b
    ));
  };

  return (
    <div className="flex-1 p-6 md:p-8 lg:p-10 bg-white overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin - All Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No bookings have been made yet.</p>
        </div>
      ) : (
        <div className="shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Booking ID</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Hotel</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Room Type</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Dates</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id} className="bg-white hover:bg-gray-50 even:bg-gray-50">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm font-mono">{booking.booking_id}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{booking.name}</p>
                    <p className="text-gray-600 whitespace-no-wrap">{booking.email}</p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{booking.hotel_name}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{booking.room_type}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{booking.check_in} to {booking.check_out}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                        booking.status === 'Confirmed'
                          ? 'text-green-900 bg-green-200'
                          : 'text-red-900 bg-red-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {booking.status === 'Confirmed' && (
                      <button 
                        onClick={() => cancelBooking(booking.booking_id)} 
                        className="text-red-500 hover:text-red-700"
                        title="Cancel Booking"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
