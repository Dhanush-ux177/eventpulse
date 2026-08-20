import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Share2, 
  Heart, 
  ArrowLeft, 
  ShieldCheck, 
  Video, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ExternalLink, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { EventItem, TicketTier } from '../types';
import { CountdownTimer } from './CountdownTimer';

interface EventDetailProps {
  event: EventItem;
  onBack: () => void;
  onBookTier: (tierId?: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShowToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  onBack,
  onBookTier,
  isBookmarked,
  onToggleBookmark,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'speakers' | 'venue' | 'faqs'>('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(event.image);

  const dateObj = new Date(event.startDate);
  const formattedFullDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const endDateObj = new Date(event.endDate);
  const formattedEndTime = endDateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const prices = event.ticketTiers.map((t) => t.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Link Copied!', 'Event URL copied to your clipboard.', 'success');
    } else {
      onShowToast('Event URL', window.location.href, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(event.id)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isBookmarked
                ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 text-rose-600 dark:text-rose-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save Event'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Share event link"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Hero Media Banner with Countdown */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative aspect-[21/9] min-h-[300px] sm:min-h-[420px] w-full">
          <img
            src={selectedGalleryImg}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              {event.format === 'online' ? (
                <>
                  <Video className="w-3.5 h-3.5 text-sky-400" /> Online Stream
                </>
              ) : event.format === 'hybrid' ? (
                <>
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Hybrid Event
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> In-Person Venue
                </>
              )}
            </span>
          </div>

          {/* Countdown timer on Top-Right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:block">
            <CountdownTimer targetDate={event.startDate} size="sm" />
          </div>

          {/* Banner bottom title and quick info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {event.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">{formattedFullDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{formattedTime} - {formattedEndTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{event.location.venueName}, {event.location.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails (if multiple images exist) */}
        {event.galleryImages && event.galleryImages.length > 0 && (
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-semibold uppercase px-2 shrink-0">Gallery:</span>
            {[event.image, ...event.galleryImages].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGalleryImg(img)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  selectedGalleryImg === img ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Tabs & Detailed Sections) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-sm font-semibold scrollbar-none">
            {[
              { id: 'overview', label: 'About Event' },
              { id: 'schedule', label: `Schedule (${event.schedule.length})` },
              { id: 'speakers', label: `Speakers (${event.speakers.length})` },
              { id: 'venue', label: 'Location & Map' },
              { id: 'faqs', label: `FAQs (${event.faqs.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Event Overview
                </h3>
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {/* Tags */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Topics:</span>
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Organizer Profile Card */}
              <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm uppercase font-bold text-slate-400 tracking-wider">
                  Organized By
                </h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.organizer.logo}
                      alt={event.organizer.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {event.organizer.name}
                        </h4>
                        {event.organizer.verified && (
                          <span title="Verified Organizer">
                            <ShieldCheck className="w-4 h-4 text-indigo-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {event.organizer.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {event.organizer.contactEmail && (
                      <a
                        href={`mailto:${event.organizer.contactEmail}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Contact</span>
                      </a>
                    )}
                    {event.organizer.website && (
                      <a
                        href={event.organizer.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Event Agenda & Timeline
                </h3>
                <span className="text-xs text-slate-500 font-medium">All times in local venue time</span>
              </div>

              {event.schedule.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Detailed schedule will be published closer to the event date.</p>
              ) : (
                <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {event.schedule.map((item, idx) => (
                    <div key={item.id} className="relative pl-10">
                      <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-850" />
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {item.time}
                          </span>
                          {item.location && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                              📍 {item.location}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        {item.speaker && (
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            🎤 Speaker: {item.speaker}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SPEAKERS */}
          {activeTab === 'speakers' && (
            <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Featured Speakers & Artists
              </h3>

              {event.speakers.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Speaker roster announced soon.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((spk) => (
                    <div
                      key={spk.id}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <img
                        src={spk.avatar}
                        alt={spk.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
                      />
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{spk.name}</h4>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{spk.role}</p>
                        <p className="text-xs text-slate-500">{spk.company}</p>
                        {spk.bio && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{spk.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VENUE & MAP */}
          {activeTab === 'venue' && (
            <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Venue Location & Entry Directions
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location.venueName}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {event.location.address}, {event.location.city}, {event.location.country}
                </p>
                {event.location.streamingUrl && (
                  <p className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1.5 pt-2">
                    <Video className="w-3.5 h-3.5" />
                    <span>Livestream Broadcast Link will be emailed with your ticket.</span>
                  </p>
                )}
              </div>

              {/* Interactive Visual Map Card */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center text-center p-6 text-white shadow-inner">
                {/* Stylized vector map background representation */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative space-y-3 max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base">{event.location.venueName}</h4>
                  <p className="text-xs text-slate-300">{event.location.address}, {event.location.city}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${event.location.venueName} ${event.location.city}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-md"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Parking & Accessibility Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Parking & Transit
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">On-site reserved parking and metro shuttle available at main gates.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Accessibility
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">Step-free access, ADA elevators, and companion seating available.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS */}
          {activeTab === 'faqs' && (
            <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {event.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Ticket Booking Summary Box */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
            
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Registration / Passes
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {minPrice === 0 ? 'Free Admission' : `$${minPrice}`}
                </span>
                {maxPrice > minPrice && (
                  <span className="text-xs text-slate-500"> - ${maxPrice}</span>
                )}
              </div>
            </div>

            {/* Ticket Tier Quick Selector */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Available Tiers
              </label>
              {event.ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => onBookTier(tier.id)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-750 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tier.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{tier.availableSeats} passes left</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {tier.price === 0 ? 'Free' : `$${tier.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              id="event-detail-book-btn"
              onClick={() => onBookTier()}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Passes & Register</span>
            </button>

            {/* Trust & Guarantee points */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant confirmation & scannable QR ticket</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full refund option up to 48 hrs before event</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
