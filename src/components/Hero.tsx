import React from 'react';
import { Search, MapPin, Sparkles, TrendingUp, ShieldCheck, Users, Calendar } from 'lucide-react';
import { EventCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: EventCategory;
  onSelectCategory: (c: EventCategory) => void;
  onExploreClick: () => void;
  onHostClick: () => void;
  categories: { name: string }[];
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onExploreClick,
  onHostClick,
}) => {
  const popularTags = ['Tech & AI', 'Electronic Music', 'Sourdough & Coffee', 'Indie Film', 'Marathon 10K'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-900 text-white pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-violet-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-medium backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Discover 2026 Concerts, Conferences & Masterclasses</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Live Experiences That <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-amber-200 bg-clip-text text-transparent">
              Inspire & Connect
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Secure verified tickets to premiere music festivals, global tech summits, intimate artisan masterclasses, and competitive sports in just seconds.
          </p>
        </div>

        {/* Integrated Search Box */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 shadow-2xl shadow-indigo-950/50">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search event name, artist, speaker, or city..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-slate-400 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition-all"
              />
            </div>

            {/* Quick Action Buttons */}
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Events</span>
            </button>
          </div>

          {/* Popular Search Tags */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 overflow-x-auto text-xs text-slate-300 text-left px-1">
            <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" /> Trending:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSearchChange(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors shrink-0 text-[11px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Metrics Proof Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Live Listings</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">150+ Events</p>
            <p className="text-[11px] text-slate-400">Across 24 top cities</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Attendees</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">50,000+</p>
            <p className="text-[11px] text-slate-400">Registered globally</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Verified</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">100% Safe</p>
            <p className="text-[11px] text-slate-400">Instant digital QR entry</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-violet-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Host with us</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">Zero Setup</p>
            <button
              onClick={onHostClick}
              className="text-[11px] text-indigo-300 hover:text-indigo-200 underline font-medium"
            >
              Launch your event &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
