import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  Calendar, 
  MapPin, 
  QrCode, 
  Printer, 
  AlertCircle, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';
import { TicketPass } from './TicketPass';

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onBookingCancelled: (id: string) => void;
  onShowToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onBookingCancelled,
  onShowToast,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking and initiate a full refund?')) {
      return;
    }

    setIsCancelling(bookingId);
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        onBookingCancelled(bookingId);
        onShowToast('Booking Cancelled', 'Your ticket was cancelled and refund processed.', 'success');
        if (selectedTicket?.id === bookingId) {
          setSelectedTicket(null);
        }
      } else {
        onShowToast('Cancellation Error', res.message, 'error');
      }
    } catch (err: any) {
      onShowToast('Error', err.message, 'error');
    } finally {
      setIsCancelling(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {selectedTicket ? 'Ticket Pass View' : 'My Event Tickets & Passes'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {bookings.length} registered event ticket(s)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (selectedTicket) {
                setSelectedTicket(null);
              } else {
                onClose();
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 dark:text-slate-100">
          
          {selectedTicket ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-2"
              >
                &larr; Back to all tickets
              </button>
              <TicketPass booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No Tickets Booked Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't reserved tickets for any upcoming events. Explore our concerts, summits, and workshops to book your passes!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Browse Upcoming Events
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {bookings.map((booking) => {
                const dateObj = new Date(booking.eventDate);
                const isRefunded = booking.paymentStatus === 'refunded';

                return (
                  <div
                    key={booking.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isRefunded
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 opacity-60'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-indigo-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <img
                        src={booking.eventImage}
                        alt={booking.eventTitle}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                            {booking.bookingRef}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isRefunded
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isRefunded ? 'Cancelled & Refunded' : 'Active Pass'}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {booking.eventTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" />
                            {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ticket className="w-3 h-3 text-indigo-500" />
                            {booking.tierName} (x{booking.ticketQuantity})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {!isRefunded && (
                        <>
                          <button
                            onClick={() => setSelectedTicket(booking)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>View Pass</span>
                          </button>

                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={isCancelling === booking.id}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Cancel booking and request refund"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
