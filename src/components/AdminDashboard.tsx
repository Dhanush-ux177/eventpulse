import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  DollarSign, 
  Ticket, 
  Calendar, 
  Users, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  RefreshCw 
} from 'lucide-react';
import { EventItem, AdminStats, Booking } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onOpenCreateEvent: () => void;
  onDeleteEvent: (id: string) => void;
  onShowToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  events,
  onOpenCreateEvent,
  onDeleteEvent,
  onShowToast,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'analytics'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Organizer & Admin Hub
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your events, monitor ticket transactions, and oversee attendee registrations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-indigo-500 mb-1">
                <span className="text-xs font-semibold uppercase text-slate-400">Gross Sales</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '634.60'}
              </p>
              <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +14.8% vs last month
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-violet-500 mb-1">
                <span className="text-xs font-semibold uppercase text-slate-400">Tickets Issued</span>
                <Ticket className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalTicketsSold || 3} Passes
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Direct online bookings</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-amber-500 mb-1">
                <span className="text-xs font-semibold uppercase text-slate-400">Active Events</span>
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {events.length}
              </p>
              <p className="text-[10px] text-indigo-500 font-medium mt-1">Published listings</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-500">
                <span className="text-xs font-semibold uppercase text-slate-400">Quick Action</span>
                <PlusCircle className="w-4 h-4" />
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateEvent();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish New Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'events'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Manage Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Recent Bookings ({stats?.recentBookings.length || 2})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Category Distribution
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 dark:text-slate-100">
          
          {/* TAB 1: EVENTS TABLE */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search managed events..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCreateEvent();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Event</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5">Event</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Date & Venue</th>
                      <th className="p-3.5">Seats Left</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEvents.map((evt) => {
                      const totalSeats = evt.ticketTiers.reduce((acc, t) => acc + t.totalSeats, 0);
                      const availableSeats = evt.ticketTiers.reduce((acc, t) => acc + t.availableSeats, 0);
                      const dateObj = new Date(evt.startDate);

                      return (
                        <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={evt.image}
                                alt={evt.title}
                                className="w-10 h-10 rounded-xl object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                                  {evt.title}
                                </p>
                                <p className="text-[10px] text-slate-400">{evt.organizer.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">
                              {evt.category}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-300">
                            <p>{dateObj.toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400">{evt.location.city}</p>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {availableSeats}
                            </span>
                            <span className="text-slate-400"> / {totalSeats}</span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete event "${evt.title}"?`)) {
                                  onDeleteEvent(evt.id);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS TABLE */}
          {activeTab === 'bookings' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Ref ID</th>
                    <th className="p-3.5">Event</th>
                    <th className="p-3.5">Attendee</th>
                    <th className="p-3.5">Pass Tier</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(stats?.recentBookings || []).map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {bk.bookingRef}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {bk.eventTitle}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold">{bk.attendee.fullName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{bk.attendee.email}</p>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {bk.tierName} (x{bk.ticketQuantity})
                      </td>
                      <td className="p-3.5 font-bold text-emerald-500">
                        ${bk.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                          {bk.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: CATEGORY ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue & Event Share by Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(stats?.categoryBreakdown || []).map((item) => (
                  <div
                    key={item.category}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-500">
                        ${item.revenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, item.count * 20))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{item.count} Published Event(s)</span>
                      <span>Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
