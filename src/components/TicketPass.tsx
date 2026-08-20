import React from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  Ticket as TicketIcon 
} from 'lucide-react';
import { Booking } from '../types';

interface TicketPassProps {
  booking: Booking;
  onClose?: () => void;
}

export const TicketPass: React.FC<TicketPassProps> = ({ booking, onClose }) => {
  const dateObj = new Date(booking.eventDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Export .ics calendar file
  const handleAddToCalendar = () => {
    const startIso = new Date(booking.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = new Date(new Date(booking.eventDate).getTime() + 4 * 3600 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventPulse//Event Ticket//EN',
      'BEGIN:VEVENT',
      `UID:${booking.bookingRef}@eventpulse.io`,
      `DTSTAMP:${startIso}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${booking.eventTitle}`,
      `DESCRIPTION:Event Booking Reference: ${booking.bookingRef}\\nTier: ${booking.tierName}\\nAttendee: ${booking.attendee.fullName}`,
      `LOCATION:${booking.eventVenue}, ${booking.eventCity}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${booking.bookingRef}-${booking.eventTitle.slice(0, 15)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Ticket Container (Printable) */}
      <div
        id="printable-ticket"
        className="relative max-w-xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl overflow-hidden border border-indigo-500/30"
      >
        {/* Top Header Section */}
        <div className="relative p-6 sm:p-8 bg-slate-900/60 backdrop-blur-md border-b border-indigo-500/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <TicketIcon className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight">
                Event<span className="text-indigo-400">Pulse</span> PASS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black mt-4 leading-tight">
            {booking.eventTitle}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="truncate">{booking.eventVenue}, {booking.eventCity}</span>
            </div>
          </div>
        </div>

        {/* Perforated Divider Styling */}
        <div className="relative flex items-center justify-between px-2 bg-slate-950">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 -ml-5 shadow-inner"></div>
          <div className="flex-1 border-b-2 border-dashed border-slate-700/80 mx-2"></div>
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 -mr-5 shadow-inner"></div>
        </div>

        {/* Ticket Details & QR Pass Section */}
        <div className="p-6 sm:p-8 bg-slate-950/90 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          {/* Left Metadata */}
          <div className="sm:col-span-7 space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Booking Reference
              </span>
              <p className="font-mono text-lg font-bold text-amber-400 tracking-wider">
                {booking.bookingRef}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Ticket Tier
                </span>
                <p className="font-bold text-white text-xs">{booking.tierName}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Quantity
                </span>
                <p className="font-bold text-white text-xs">{booking.ticketQuantity} Pass(es)</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Primary Attendee
              </span>
              <p className="font-bold text-white">{booking.attendee.fullName}</p>
              <p className="text-[11px] text-slate-400 truncate">{booking.attendee.email}</p>
            </div>

            {booking.selectedAddOns && booking.selectedAddOns.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Add-Ons Included
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {booking.selectedAddOns.map((addon) => (
                    <span
                      key={addon.addOnId}
                      className="px-2 py-0.5 rounded bg-indigo-900/50 border border-indigo-700/50 text-[10px] text-indigo-200"
                    >
                      {addon.name} (x{addon.quantity})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Paid:</span>
              <span className="font-bold text-emerald-400 text-sm">
                ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right Digital QR & Barcode Section */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 shadow-inner text-center">
            {/* High visual QR Code simulation */}
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <svg
                viewBox="0 0 100 100"
                className="w-28 h-28 mx-auto"
                shapeRendering="crispEdges"
              >
                {/* Visual stylized QR matrix blocks */}
                <rect width="100" height="100" fill="white" />
                {/* Top-Left Finder */}
                <rect x="10" y="10" width="24" height="24" fill="black" />
                <rect x="14" y="14" width="16" height="16" fill="white" />
                <rect x="18" y="18" width="8" height="8" fill="black" />
                {/* Top-Right Finder */}
                <rect x="66" y="10" width="24" height="24" fill="black" />
                <rect x="70" y="14" width="16" height="16" fill="white" />
                <rect x="74" y="18" width="8" height="8" fill="black" />
                {/* Bottom-Left Finder */}
                <rect x="10" y="66" width="24" height="24" fill="black" />
                <rect x="14" y="70" width="16" height="16" fill="white" />
                <rect x="18" y="74" width="8" height="8" fill="black" />
                {/* Inner Data Cells */}
                <rect x="42" y="12" width="4" height="12" fill="black" />
                <rect x="52" y="16" width="6" height="6" fill="black" />
                <rect x="42" y="42" width="16" height="16" fill="black" />
                <rect x="46" y="46" width="8" height="8" fill="white" />
                <rect x="20" y="42" width="6" height="14" fill="black" />
                <rect x="68" y="42" width="14" height="6" fill="black" />
                <rect x="42" y="68" width="8" height="18" fill="black" />
                <rect x="56" y="64" width="12" height="10" fill="black" />
                <rect x="74" y="68" width="12" height="12" fill="black" />
              </svg>
            </div>

            <p className="text-[10px] font-mono font-bold tracking-widest text-slate-800 mt-2">
              SCAN AT ENTRY GATE
            </p>
            <p className="text-[9px] text-slate-500">Fast-track admission</p>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="bg-slate-900 px-6 py-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
          <span>Issued by EventPulse Live</span>
          <span>100% Guaranteed Entry</span>
        </div>
      </div>

      {/* Action Buttons (Excluded in Print) */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>

        <button
          onClick={handleAddToCalendar}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Add to Calendar (.ics)</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-colors"
          >
            Done
          </button>
        )}
      </div>

    </div>
  );
};
