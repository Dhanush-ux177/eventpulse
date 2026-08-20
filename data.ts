import { EventItem, Booking, PromoCode, AdminStats } from './src/types';
import { INITIAL_EVENTS, INITIAL_PROMO_CODES } from './src/data/mockEvents';

class DatabaseStore {
  private events: EventItem[] = [];
  private bookings: Booking[] = [];
  private promoCodes: PromoCode[] = [];

  constructor() {
    this.events = JSON.parse(JSON.stringify(INITIAL_EVENTS));
    this.promoCodes = JSON.parse(JSON.stringify(INITIAL_PROMO_CODES));

    // Seed some initial bookings for realistic admin stats
    this.seedInitialBookings();
  }

  private seedInitialBookings() {
    this.bookings = [
      {
        id: 'bk-1001',
        bookingRef: 'EP-98234',
        eventId: 'evt-1',
        eventTitle: 'Neon Horizon Music & Lights Festival 2026',
        eventDate: '2026-09-18T16:00:00Z',
        eventVenue: 'Bayfront Amphitheater & Soundpark',
        eventCity: 'San Francisco',
        eventImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        tierId: 'tier-1-ga',
        tierName: 'General Admission (3-Day Pass)',
        ticketQuantity: 2,
        ticketUnitPrice: 129,
        selectedAddOns: [
          { addOnId: 'addon-1-merch', name: 'Official 2026 Festival Hoodie & Pin Set', price: 45, quantity: 1 }
        ],
        promoCodeApplied: 'EARLYBIRD20',
        discountAmount: 50,
        subtotal: 303,
        serviceFee: 15.15,
        totalAmount: 268.15,
        attendee: {
          fullName: 'Alex Morgan',
          email: 'alex.morgan@example.com',
          phone: '+1 (415) 800-9123',
          companyOrOrg: 'SoundCraft Media',
        },
        paymentMethod: 'card',
        paymentStatus: 'completed',
        qrCodeData: 'EP-98234-EVT1-ALEX-MORGAN-2026',
        createdAt: '2026-08-15T14:20:00Z',
      },
      {
        id: 'bk-1002',
        bookingRef: 'EP-44192',
        eventId: 'evt-2',
        eventTitle: 'Global AI & Future Tech Summit 2026',
        eventDate: '2026-10-12T09:00:00Z',
        eventVenue: 'Metropolis Convention & Tech Center',
        eventCity: 'Austin',
        eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        tierId: 'tier-2-standard',
        tierName: 'In-Person Full Conference Pass',
        ticketQuantity: 1,
        ticketUnitPrice: 349,
        selectedAddOns: [],
        discountAmount: 0,
        subtotal: 349,
        serviceFee: 17.45,
        totalAmount: 366.45,
        attendee: {
          fullName: 'David K. Chen',
          email: 'david.chen@enterprise.dev',
          phone: '+1 (512) 883-9912',
          companyOrOrg: 'NeuralMatrix Inc',
        },
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
        qrCodeData: 'EP-44192-EVT2-DAVID-CHEN-2026',
        createdAt: '2026-08-18T09:45:00Z',
      },
    ];
  }

  public getEvents(filters?: {
    search?: string;
    category?: string;
    format?: string;
    dateRange?: string;
    priceRange?: string;
    sortBy?: string;
    featured?: string;
  }): EventItem[] {
    let result = [...this.events];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.city.toLowerCase().includes(q) ||
          e.location.venueName.toLowerCase().includes(q) ||
          e.organizer.name.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((e) => e.category === filters.category);
    }

    if (filters?.format && filters.format !== 'all') {
      result = result.filter((e) => e.format === filters.format);
    }

    if (filters?.featured === 'true') {
      result = result.filter((e) => e.featured);
    }

    if (filters?.priceRange && filters.priceRange !== 'all') {
      result = result.filter((e) => {
        const minPrice = Math.min(...e.ticketTiers.map((t) => t.price));
        if (filters.priceRange === 'free') return minPrice === 0;
        if (filters.priceRange === 'under50') return minPrice < 50;
        if (filters.priceRange === '50to150') return minPrice >= 50 && minPrice <= 150;
        if (filters.priceRange === 'above150') return minPrice > 150;
        return true;
      });
    }

    // Sort
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          result.sort((a, b) => {
            const minA = Math.min(...a.ticketTiers.map((t) => t.price));
            const minB = Math.min(...b.ticketTiers.map((t) => t.price));
            return minA - minB;
          });
          break;
        case 'price_desc':
          result.sort((a, b) => {
            const minA = Math.min(...a.ticketTiers.map((t) => t.price));
            const minB = Math.min(...b.ticketTiers.map((t) => t.price));
            return minB - minA;
          });
          break;
        case 'popular':
          result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'upcoming':
        default:
          result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          break;
      }
    }

    return result;
  }

  public getEventById(id: string): EventItem | undefined {
    return this.events.find((e) => e.id === id || e.slug === id);
  }

  public createEvent(data: Partial<EventItem>): EventItem {
    const id = `evt-${Date.now()}`;
    const slug = (data.title || 'event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newEvent: EventItem = {
      id,
      title: data.title || 'Untitled Event',
      slug,
      category: data.category || 'Tech & Conferences',
      tagline: data.tagline || '',
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      galleryImages: data.galleryImages || [],
      startDate: data.startDate || new Date(Date.now() + 86400000 * 14).toISOString(),
      endDate: data.endDate || new Date(Date.now() + 86400000 * 15).toISOString(),
      doorsOpenTime: data.doorsOpenTime || '09:00 AM',
      format: data.format || 'in-person',
      location: data.location || {
        venueName: 'Main Convention Hall',
        address: '100 City Center Blvd',
        city: 'New York',
        country: 'United States',
      },
      organizer: data.organizer || {
        id: `org-${Date.now()}`,
        name: 'EventPulse Organizer',
        logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Premier event organizer.',
        verified: true,
        contactEmail: 'organizer@eventpulse.io',
      },
      ticketTiers: data.ticketTiers && data.ticketTiers.length > 0 ? data.ticketTiers : [
        {
          id: `tier-${Date.now()}-1`,
          name: 'General Admission',
          price: 49,
          description: 'Standard event access ticket.',
          perks: ['Full event access', 'Badge & Welcome kit'],
          totalSeats: 200,
          availableSeats: 200,
        },
      ],
      addOns: data.addOns || [],
      speakers: data.speakers || [],
      schedule: data.schedule || [],
      faqs: data.faqs || [
        { question: 'What is the refund policy?', answer: 'Cancellations are accepted up to 48 hours before the event starts.' },
      ],
      tags: data.tags || ['Event', 'Live'],
      featured: Boolean(data.featured),
      status: data.status || 'published',
      totalViews: 0,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(newEvent);
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<EventItem>): EventItem | null {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    this.events[idx] = {
      ...this.events[idx],
      ...updates,
      id: this.events[idx].id, // preserve immutable ID
    };
    return this.events[idx];
  }

  public deleteEvent(id: string): boolean {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.events.splice(idx, 1);
    return true;
  }

  public validatePromo(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string; promo?: PromoCode } {
    const cleanCode = code.toUpperCase().trim();
    const promo = this.promoCodes.find((p) => p.code === cleanCode);

    if (!promo) {
      return { valid: false, discountAmount: 0, message: 'Invalid promo code entered.' };
    }

    if (subtotal < promo.minimumSpend) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Promo requires a minimum spend of $${promo.minimumSpend}.`,
      };
    }

    let calculatedDiscount = (subtotal * promo.discountPercentage) / 100;
    if (promo.maxDiscount && calculatedDiscount > promo.maxDiscount) {
      calculatedDiscount = promo.maxDiscount;
    }

    return {
      valid: true,
      discountAmount: Math.round(calculatedDiscount * 100) / 100,
      message: `Success! ${promo.description}`,
      promo,
    };
  }

  public createBooking(bookingData: {
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
  }): { success: boolean; booking?: Booking; error?: string } {
    const event = this.getEventById(bookingData.eventId);
    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const tier = event.ticketTiers.find((t) => t.id === bookingData.tierId);
    if (!tier) {
      return { success: false, error: 'Invalid ticket tier selected' };
    }

    if (tier.availableSeats < bookingData.quantity) {
      return {
        success: false,
        error: `Only ${tier.availableSeats} seat(s) remaining for this tier.`,
      };
    }

    // Decrement available seats
    tier.availableSeats -= bookingData.quantity;

    // Process add-ons
    const processedAddOns: { addOnId: string; name: string; price: number; quantity: number }[] = [];
    let addOnsTotal = 0;

    if (bookingData.selectedAddOns && event.addOns) {
      for (const item of bookingData.selectedAddOns) {
        const foundAddon = event.addOns.find((a) => a.id === item.addOnId);
        if (foundAddon && item.quantity > 0) {
          processedAddOns.push({
            addOnId: foundAddon.id,
            name: foundAddon.name,
            price: foundAddon.price,
            quantity: item.quantity,
          });
          addOnsTotal += foundAddon.price * item.quantity;
        }
      }
    }

    const ticketSubtotal = tier.price * bookingData.quantity;
    const subtotal = ticketSubtotal + addOnsTotal;

    let discountAmount = 0;
    let promoCodeApplied = undefined;

    if (bookingData.promoCode) {
      const promoCheck = this.validatePromo(bookingData.promoCode, subtotal);
      if (promoCheck.valid) {
        discountAmount = promoCheck.discountAmount;
        promoCodeApplied = bookingData.promoCode.toUpperCase().trim();
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    // 5% standard processing & service fee (waived if $0)
    const serviceFee = discountedSubtotal > 0 ? Math.round(discountedSubtotal * 0.05 * 100) / 100 : 0;
    const totalAmount = Math.round((discountedSubtotal + serviceFee) * 100) / 100;

    const randNum = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `EP-${randNum}`;
    const id = `bk-${Date.now()}`;

    const qrPayload = JSON.stringify({
      ref: bookingRef,
      event: event.title,
      tier: tier.name,
      qty: bookingData.quantity,
      holder: bookingData.attendee.fullName,
      email: bookingData.attendee.email,
      date: event.startDate,
      venue: event.location.venueName,
    });

    const newBooking: Booking = {
      id,
      bookingRef,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventVenue: event.location.venueName,
      eventCity: event.location.city,
      eventImage: event.image,
      tierId: tier.id,
      tierName: tier.name,
      ticketQuantity: bookingData.quantity,
      ticketUnitPrice: tier.price,
      selectedAddOns: processedAddOns,
      promoCodeApplied,
      discountAmount,
      subtotal,
      serviceFee,
      totalAmount,
      attendee: bookingData.attendee,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: 'completed',
      qrCodeData: qrPayload,
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    return { success: true, booking: newBooking };
  }

  public getBookings(query?: { email?: string; eventId?: string }): Booking[] {
    let list = [...this.bookings];
    if (query?.email) {
      list = list.filter((b) => b.attendee.email.toLowerCase() === query.email?.toLowerCase());
    }
    if (query?.eventId) {
      list = list.filter((b) => b.eventId === query.eventId);
    }
    return list;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id || b.bookingRef === id);
  }

  public cancelBooking(id: string): { success: boolean; message: string } {
    const booking = this.getBookingById(id);
    if (!booking) return { success: false, message: 'Booking not found' };

    if (booking.paymentStatus === 'refunded') {
      return { success: false, message: 'Booking is already cancelled and refunded.' };
    }

    booking.paymentStatus = 'refunded';

    // Restore ticket seats
    const event = this.getEventById(booking.eventId);
    if (event) {
      const tier = event.ticketTiers.find((t) => t.id === booking.tierId);
      if (tier) {
        tier.availableSeats = Math.min(tier.totalSeats, tier.availableSeats + booking.ticketQuantity);
      }
    }

    return { success: true, message: 'Booking successfully cancelled and refund initiated.' };
  }

  public getAdminStats(): AdminStats {
    const validBookings = this.bookings.filter((b) => b.paymentStatus === 'completed');
    const totalRevenue = validBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = validBookings.reduce((sum, b) => sum + b.ticketQuantity, 0);

    const categoryMap: Record<string, { count: number; revenue: number }> = {};
    for (const evt of this.events) {
      if (!categoryMap[evt.category]) {
        categoryMap[evt.category] = { count: 0, revenue: 0 };
      }
      categoryMap[evt.category].count += 1;
    }

    for (const b of validBookings) {
      const evt = this.getEventById(b.eventId);
      if (evt && categoryMap[evt.category]) {
        categoryMap[evt.category].revenue += b.totalAmount;
      }
    }

    const categoryBreakdown = Object.entries(categoryMap).map(([category, val]) => ({
      category,
      count: val.count,
      revenue: Math.round(val.revenue * 100) / 100,
    }));

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalTicketsSold,
      totalEvents: this.events.length,
      activeAttendees: validBookings.length,
      categoryBreakdown,
      recentBookings: this.bookings.slice(0, 8),
    };
  }
}

export const db = new DatabaseStore();
