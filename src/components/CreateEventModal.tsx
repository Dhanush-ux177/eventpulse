import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Loader2 
} from 'lucide-react';
import { EventItem, EventCategory, EventFormat, TicketTier } from '../types';
import { api } from '../services/api';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventItem) => void;
  onShowToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

const PRESET_IMAGES = [
  { label: 'Concert / Neon Stage', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tech Conference / AI', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Culinary Masterclass', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Film Festival / Theater', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Marathon & Sports', url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Business Networking', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  onShowToast,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Tech & Conferences');
  const [format, setFormat] = useState<EventFormat>('in-person');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);

  // Date & Venue
  const [startDate, setStartDate] = useState('2026-10-15T10:00');
  const [endDate, setEndDate] = useState('2026-10-15T18:00');
  const [venueName, setVenueName] = useState('Metropolitan Civic Center');
  const [address, setAddress] = useState('100 Main Street');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('United States');

  // Organizer info
  const [organizerName, setOrganizerName] = useState('Vanguard Experience Studio');
  const [organizerEmail, setOrganizerEmail] = useState('host@eventpulse.io');

  // Ticket Tiers
  const [tiers, setTiers] = useState<TicketTier[]>([
    {
      id: 'tier-ga-custom',
      name: 'General Admission Pass',
      price: 49,
      description: 'Full single day pass with stage access.',
      perks: ['Grounds admission', 'Digital badge'],
      totalSeats: 250,
      availableSeats: 250,
    },
  ]);

  if (!isOpen) return null;

  const handleAddTier = () => {
    setTiers([
      ...tiers,
      {
        id: `tier-${Date.now()}`,
        name: 'VIP Experience Pass',
        price: 120,
        description: 'Priority access and lounge perks.',
        perks: ['Fast-track admission', 'VIP lounge'],
        totalSeats: 50,
        availableSeats: 50,
      },
    ]);
  };

  const handleRemoveTier = (idx: number) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Missing Title', 'Please enter an event title.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<EventItem> = {
        title,
        category,
        format,
        tagline: tagline || title,
        description: description || 'Join us for this exciting live event experience.',
        image,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        location: {
          venueName,
          address,
          city,
          country,
        },
        organizer: {
          id: `org-${Date.now()}`,
          name: organizerName || 'Event Host',
          logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          bio: 'Verified event organizer on EventPulse.',
          verified: true,
          contactEmail: organizerEmail || 'contact@eventpulse.io',
        },
        ticketTiers: tiers,
        tags: [category.split(' ')[0], 'Live', '2026'],
      };

      const res = await api.createEvent(payload);
      if (res.success && res.data) {
        onEventCreated(res.data);
        onShowToast('Event Created!', 'Your new event is now live and bookable.', 'success');
        onClose();
      } else {
        onShowToast('Failed to create event', res.error, 'error');
      }
    } catch (err: any) {
      onShowToast('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Host / Publish New Event
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup details, ticket tiers, venue, and ticketing configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800 dark:text-slate-200">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Basic Details
            </h3>

            <div>
              <label className="block font-semibold mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next-Gen Web & AI Summit 2026"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 cursor-pointer"
                >
                  <option value="Music & Concerts">Music & Concerts</option>
                  <option value="Tech & Conferences">Tech & Conferences</option>
                  <option value="Workshops & Masterclasses">Workshops & Masterclasses</option>
                  <option value="Festivals & Arts">Festivals & Arts</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Business & Networking">Business & Networking</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as EventFormat)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 cursor-pointer"
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online Livestream</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Short Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="A one-sentence summary for preview cards"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive details about the event schedule, highlights, and what to bring..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
              />
            </div>
          </div>

          {/* Banner Photo Selector */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" /> Event Cover Poster
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setImage(preset.url)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    image === preset.url ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 font-mono text-[11px]"
            />
          </div>

          {/* Date & Location */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" /> Date, Time & Venue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Venue Name</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. City Arena"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850"
                />
              </div>
            </div>
          </div>

          {/* Ticket Tiers */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-500" /> Ticket Tiers & Pricing
              </h3>
              <button
                type="button"
                onClick={handleAddTier}
                className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:bg-indigo-100"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tier
              </button>
            </div>

            {tiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Tier #{idx + 1}</span>
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => {
                      const updated = [...tiers];
                      updated[idx].name = e.target.value;
                      setTiers(updated);
                    }}
                    placeholder="Tier Name (e.g. Early Bird)"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="number"
                    value={tier.price}
                    onChange={(e) => {
                      const updated = [...tiers];
                      updated[idx].price = Number(e.target.value);
                      setTiers(updated);
                    }}
                    placeholder="Price ($)"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="number"
                    value={tier.totalSeats}
                    onChange={(e) => {
                      const updated = [...tiers];
                      const val = Number(e.target.value);
                      updated[idx].totalSeats = val;
                      updated[idx].availableSeats = val;
                      setTiers(updated);
                    }}
                    placeholder="Total Seats Capacity"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Event &rarr;</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
