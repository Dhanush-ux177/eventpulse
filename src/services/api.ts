import { EventItem, Booking, AdminStats, FilterOptions, PromoCode } from '../types';
import { INITIAL_EVENTS, INITIAL_PROMO_CODES } from '../data/mockEvents';

const BASE_URL = '/api';

export const api = {
  // Fetch events
  async getEvents(filters?: Partial<FilterOptions>): Promise<EventItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.searchQuery) params.append('search', filters.searchQuery);
      if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters?.format && filters.format !== 'all') params.append('format', filters.format);
      if (filters?.dateRange && filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
      if (filters?.priceRange && filters.priceRange !== 'all') params.append('priceRange', filters.priceRange);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);

      const res = await fetch(`${BASE_URL}/events?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API fetch failed, fallback to local dataset', err);
      return INITIAL_EVENTS;
    }
  },

  // Get single event
  async getEventById(id: string): Promise<EventItem | null> {
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`);
      if (!res.ok) throw new Error('Event not found');
      const data = await res.json();
      return data.data;
    } catch (err) {
      const fallback = INITIAL_EVENTS.find((e) => e.id === id || e.slug === id);
      return fallback || null;
    }
  },

  // Validate Promo Code
  async validatePromoCode(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; message: string; promo?: PromoCode }> {
    try {
      const res = await fetch(`${BASE_URL}/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      return await res.json();
    } catch (err) {
      const found = INITIAL_PROMO_CODES.find((p) => p.code.toUpperCase() === code.toUpperCase().trim());
      if (found) {
        const discount = Math.min((subtotal * found.discountPercentage) / 100, found.maxDiscount || Infinity);
        return { valid: true, discountAmount: discount, message: found.description, promo: found };
      }
      return { valid: false, discountAmount: 0, message: 'Invalid promo code' };
    }
  },

  // Book tickets
  async createBooking(payload: {
    eventId: string;
    tierId: string;
    quantity: number;
    selectedAddOns?: { addOnId: string; quantity: number }[];
    attendee: {
      fullName: string;
      email: string;
      phone: string;
      companyOrOrg?: string;
      specialRequests?: string;
      dietaryPreference?: string;
    };
    promoCode?: string;
    paymentMethod: 'card' | 'wallet' | 'bank_transfer';
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete booking');
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during checkout' };
    }
  },

  // Get user bookings
  async getBookings(email?: string): Promise<Booking[]> {
    try {
      const url = email ? `${BASE_URL}/bookings?email=${encodeURIComponent(email)}` : `${BASE_URL}/bookings`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to cancel booking' };
    }
  },

  // Get Admin / Organizer Stats
  async getAdminStats(): Promise<AdminStats | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`);
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return null;
    }
  },

  // Create Event
  async createEvent(eventData: Partial<EventItem>): Promise<{ success: boolean; data?: EventItem; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');
      return { success: true, data: data.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Delete Event
  async deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete event');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
