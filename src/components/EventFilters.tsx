import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, DollarSign, Calendar, MapPin, ArrowUpDown, X } from 'lucide-react';
import { FilterOptions, EventFormat } from '../types';

interface EventFiltersProps {
  filters: FilterOptions;
  onChange: (updates: Partial<FilterOptions>) => void;
  onReset: () => void;
  totalResults: number;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.format !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.sortBy !== 'upcoming';

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Top Search & Sorting Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search text */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search by event title, organizer, city, or tags..."
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Format Select */}
        <div className="md:col-span-3">
          <select
            value={filters.format}
            onChange={(e) => onChange({ format: e.target.value as any })}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">🌐 All Formats</option>
            <option value="in-person">📍 In-Person</option>
            <option value="online">💻 Online Livestream</option>
            <option value="hybrid">⚡ Hybrid (In-Person + Live)</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="md:col-span-3">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="upcoming">⏳ Sort: Date Soonest</option>
            <option value="popular">🔥 Sort: Most Popular</option>
            <option value="price_asc">💵 Sort: Price (Low to High)</option>
            <option value="price_desc">💎 Sort: Price (High to Low)</option>
            <option value="newest">✨ Sort: Newly Added</option>
          </select>
        </div>
      </div>

      {/* Secondary Fast Filters (Date & Price) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        
        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0 mr-1">
            <Calendar className="w-3.5 h-3.5" /> When:
          </span>
          {[
            { id: 'all', label: 'Any Date' },
            { id: 'today', label: 'Today' },
            { id: 'tomorrow', label: 'Tomorrow' },
            { id: 'this_weekend', label: 'This Weekend' },
            { id: 'this_month', label: 'This Month' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onChange({ dateRange: d.id as any })}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                filters.dateRange === d.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Price Range Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0 mr-1">
            <DollarSign className="w-3.5 h-3.5" /> Price:
          </span>
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'free', label: 'Free Only' },
            { id: 'under50', label: '< $50' },
            { id: '50to150', label: '$50 - $150' },
            { id: 'above150', label: '$150+' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => onChange({ priceRange: p.id as any })}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                filters.priceRange === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Clear Filters Button & Results Count */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">
            Showing <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{totalResults}</strong> events
          </span>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
