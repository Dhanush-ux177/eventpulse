import React, { useState, useEffect, useRef } from 'react';
import { 
  EventItem, 
  EventCategory, 
  FilterOptions, 
  Booking, 
  UserProfile 
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryPills } from './components/CategoryPills';
import { EventFilters } from './components/EventFilters';
import { EventCard } from './components/EventCard';
import { EventDetail } from './components/EventDetail';
import { BookingModal } from './components/BookingModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CreateEventModal } from './components/CreateEventModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Sparkles, Calendar, Heart, ArrowRight } from 'lucide-react';

const INITIAL_FILTERS: FilterOptions = {
  searchQuery: '',
  category: 'All',
  format: 'all',
  dateRange: 'all',
  priceRange: 'all',
  sortBy: 'upcoming',
};

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || true;
  });

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('eventpulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'usr-default',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'attendee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
  });

  // Bookmarks / Saved events
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('eventpulse_bookmarks');
    return saved ? JSON.parse(saved) : ['evt-1', 'evt-2'];
  });

  // Bookings list
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Events & Filters
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);

  // Navigation / Active Views
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [bookingInitialTierId, setBookingInitialTierId] = useState<string | undefined>();
  const [myTicketsOpen, setMyTicketsOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [createEventOpen, setCreateEventOpen] = useState<boolean>(false);
  const [authOpen, setAuthOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search anchor ref
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Theme change sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load events
  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await api.getEvents(filters);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    try {
      const data = await api.getBookings(user?.email);
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleBookmark = (eventId: string) => {
    const next = bookmarks.includes(eventId)
      ? bookmarks.filter((id) => id !== eventId)
      : [...bookmarks, eventId];
    setBookmarks(next);
    localStorage.setItem('eventpulse_bookmarks', JSON.stringify(next));

    if (bookmarks.includes(eventId)) {
      showToast('Removed from Saved', 'Event removed from your bookmarks.', 'info');
    } else {
      showToast('Saved to Bookmarks!', 'Event added to your saved list.', 'success');
    }
  };

  const handleOpenBooking = (event: EventItem, tierId?: string) => {
    setBookingEvent(event);
    setBookingInitialTierId(tierId);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast('Booking Confirmed!', `Reference #${newBooking.bookingRef} saved to your wallet.`, 'success');
    loadEvents(); // refresh seat availability
  };

  const handleBookingCancelled = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus: 'refunded' as const } : b))
    );
    loadEvents();
  };

  const handleEventCreated = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeleteEvent = async (id: string) => {
    const res = await api.deleteEvent(id);
    if (res.success) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast('Event Deleted', 'The event has been permanently removed.', 'success');
    } else {
      showToast('Error', res.error, 'error');
    }
  };

  const scrollToSearch = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
    }
    setTimeout(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Category counts
  const categoryCounts = events.reduce((acc, evt) => {
    acc[evt.category] = (acc[evt.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  categoryCounts['All'] = events.length;

  const featuredEvents = events.filter((e) => e.featured);
  const activeTicketsCount = bookings.filter((b) => b.paymentStatus === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('eventpulse_user');
          showToast('Signed Out', 'You have been signed out of your account.', 'info');
        }}
        onOpenMyTickets={() => setMyTicketsOpen(true)}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        activeTicketsCount={activeTicketsCount}
        onNavigateHome={() => setSelectedEvent(null)}
        onSearchFocus={scrollToSearch}
      />

      {/* Main Content View Switcher */}
      {selectedEvent ? (
        <EventDetail
          event={selectedEvent}
          onBack={() => setSelectedEvent(null)}
          onBookTier={(tierId) => handleOpenBooking(selectedEvent, tierId)}
          isBookmarked={bookmarks.includes(selectedEvent.id)}
          onToggleBookmark={handleToggleBookmark}
          onShowToast={showToast}
        />
      ) : (
        <main className="flex-1 space-y-12">
          
          {/* Hero Section */}
          <Hero
            searchQuery={filters.searchQuery}
            onSearchChange={(q) => {
              setFilters((prev) => ({ ...prev, searchQuery: q }));
              if (searchSectionRef.current) {
                searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            selectedCategory={filters.category}
            onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
            onExploreClick={scrollToSearch}
            onHostClick={() => setCreateEventOpen(true)}
            categories={Object.keys(categoryCounts).map((name) => ({ name }))}
          />

          {/* Featured / Highlighted Events Carousel / Banner */}
          {featuredEvents.length > 0 && !filters.searchQuery && filters.category === 'All' && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Editor's Choice
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Featured Spotlight Events
                  </h2>
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Verified Premiere Experiences
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredEvents.slice(0, 2).map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onSelectEvent={(e) => setSelectedEvent(e)}
                    onQuickBook={(e) => handleOpenBooking(e)}
                    isBookmarked={bookmarks.includes(evt.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Search, Filter & Discover Section */}
          <section
            ref={searchSectionRef}
            id="explore-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Explore Upcoming Events
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Find and book live experiences across music, conferences, workshops, and athletics
                  </p>
                </div>
              </div>

              {/* Category Pills Bar */}
              <CategoryPills
                selectedCategory={filters.category}
                onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
                categoryCounts={categoryCounts}
              />

              {/* Comprehensive Filter Panel */}
              <EventFilters
                filters={filters}
                onChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
                onReset={() => setFilters(INITIAL_FILTERS)}
                totalResults={events.length}
              />
            </div>

            {/* Events Grid */}
            {loadingEvents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    No Events Matching Your Search
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Try adjusting your search keyword, category, date, or price filters to discover more events.
                  </p>
                </div>
                <button
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onSelectEvent={(e) => setSelectedEvent(e)}
                    onQuickBook={(e) => handleOpenBooking(e)}
                    isBookmarked={bookmarks.includes(evt.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Organizer Callout Banner */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-indigo-200 backdrop-blur-sm">
                  Organizer Platform
                </span>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  Hosting a Concert, Summit or Workshop in 2026?
                </h3>
                <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                  List your event in minutes with real-time seat inventory, custom ticket tiers, discount promo codes, and fast digital QR gate entry scanners.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  onClick={() => setCreateEventOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 transition-all shadow-xl hover:scale-105"
                >
                  Create & Host Event
                </button>
                <button
                  onClick={() => setAdminOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Open Organizer Hub
                </button>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedEvent(null);
          setFilters((prev) => ({ ...prev, category: cat }));
          scrollToSearch();
        }}
        onOpenCreateEvent={() => setCreateEventOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onShowToast={showToast}
      />

      {/* Booking Modal */}
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          initialTierId={bookingInitialTierId}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* My Tickets Modal */}
      <MyTicketsModal
        isOpen={myTicketsOpen}
        onClose={() => setMyTicketsOpen(false)}
        bookings={bookings}
        onBookingCancelled={handleBookingCancelled}
        onShowToast={showToast}
      />

      {/* Organizer & Admin Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        events={events}
        onOpenCreateEvent={() => {
          setAdminOpen(false);
          setCreateEventOpen(true);
        }}
        onDeleteEvent={handleDeleteEvent}
        onShowToast={showToast}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onEventCreated={handleEventCreated}
        onShowToast={showToast}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          localStorage.setItem('eventpulse_user', JSON.stringify(loggedInUser));
          showToast(`Welcome, ${loggedInUser.name}!`, `Signed in as ${loggedInUser.role}.`, 'success');
        }}
      />

    </div>
  );
}
