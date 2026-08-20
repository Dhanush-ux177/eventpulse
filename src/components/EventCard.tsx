import React from 'react';
import { Calendar, MapPin, Ticket, Heart, Users, Video, Sparkles, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  onSelectEvent: (event: EventItem) => void;
  onQuickBook: (event: EventItem) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectEvent,
  onQuickBook,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  // Format human-friendly date
  const dateObj = new Date(event.startDate);
  const formattedMonth = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const formattedDay = dateObj.getDate();
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Calculate starting price
  const prices = event.ticketTiers.map((t) => t.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const isFree = minPrice === 0;

  // Calculate total available seats
  const totalAvailable = event.ticketTiers.reduce((acc, t) => acc + t.availableSeats, 0);
  const isSoldOut = totalAvailable === 0;

  return (
    <div
      id={`event-card-${event.id}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image Banner Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Date Float Badge */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-12 h-14 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-white/20 text-slate-900 dark:text-white select-none">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
            {formattedMonth}
          </span>
          <span className="text-lg font-black leading-tight">
            {formattedDay}
          </span>
        </div>

        {/* Top-Right Badges & Wishlist */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {event.featured && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-current" /> Featured
            </span>
          )}

          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(event.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                isBookmarked
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/40 hover:bg-black/60 text-white hover:text-rose-400'
              }`}
              aria-label="Save to bookmarks"
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Category & Format Pill on Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md font-medium text-[11px] border border-white/10">
            {event.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md font-medium text-[11px] border border-white/10 flex items-center gap-1">
            {event.format === 'online' ? (
              <>
                <Video className="w-3 h-3 text-sky-400" /> Online
              </>
            ) : event.format === 'hybrid' ? (
              <>
                <Users className="w-3 h-3 text-emerald-400" /> Hybrid
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3 text-rose-400" /> In-Person
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-5">
        
        {/* Title */}
        <h3
          onClick={() => onSelectEvent(event)}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
        >
          {event.title}
        </h3>

        {/* Venue & Time metadata */}
        <div className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{formattedTime} • Doors open {event.doorsOpenTime || 'early'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium">
              {event.location.venueName}, {event.location.city}
            </span>
          </div>
        </div>

        {/* Short description */}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {event.tagline || event.description}
        </p>

        {/* Inventory Urgency Notification */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Tickets From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {isFree ? 'Free' : `$${minPrice}`}
              </span>
              {!isFree && <span className="text-[11px] text-slate-400">/ person</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectEvent(event)}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onQuickBook(event)}
              disabled={isSoldOut}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${
                isSoldOut
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:scale-[1.02]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{isSoldOut ? 'Sold Out' : 'Book'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
