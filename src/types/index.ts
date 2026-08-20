export type EventCategory = 
  | 'All'
  | 'Music & Concerts'
  | 'Tech & Conferences'
  | 'Workshops & Masterclasses'
  | 'Festivals & Arts'
  | 'Sports & Fitness'
  | 'Business & Networking';

export type EventFormat = 'in-person' | 'online' | 'hybrid';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  totalSeats: number;
  availableSeats: number;
  badge?: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  location?: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface EventAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  tagline: string;
  description: string;
  image: string;
  galleryImages?: string[];
  startDate: string; // ISO format or YYYY-MM-DDTHH:mm
  endDate: string;
  doorsOpenTime?: string;
  format: EventFormat;
  location: {
    venueName: string;
    address: string;
    city: string;
    country: string;
    mapCoordinates?: { lat: number; lng: number };
    streamingUrl?: string;
  };
  organizer: {
    id: string;
    name: string;
    logo: string;
    bio: string;
    verified: boolean;
    contactEmail: string;
    phone?: string;
    website?: string;
  };
  ticketTiers: TicketTier[];
  addOns?: EventAddOn[];
  speakers: Speaker[];
  schedule: ScheduleItem[];
  faqs: FAQItem[];
  tags: string[];
  featured?: boolean;
  status: 'published' | 'draft' | 'sold_out' | 'cancelled';
  totalViews?: number;
  likesCount?: number;
  createdAt: string;
}

export interface AttendeeInfo {
  fullName: string;
  email: string;
  phone: string;
  companyOrOrg?: string;
  specialRequests?: string;
  dietaryPreference?: string;
}

export interface SelectedAddOn {
  addOnId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "EP-78921"
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
  eventImage: string;
  tierId: string;
  tierName: string;
  ticketQuantity: number;
  ticketUnitPrice: number;
  selectedAddOns: SelectedAddOn[];
  promoCodeApplied?: string;
  discountAmount: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
  attendee: AttendeeInfo;
  paymentMethod: 'card' | 'wallet' | 'bank_transfer';
  paymentStatus: 'completed' | 'pending' | 'refunded';
  qrCodeData: string;
  createdAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: EventCategory;
  format: 'all' | EventFormat;
  dateRange: 'all' | 'today' | 'tomorrow' | 'this_weekend' | 'this_month' | 'custom';
  priceRange: 'all' | 'free' | 'under50' | '50to150' | 'above150';
  sortBy: 'upcoming' | 'popular' | 'price_asc' | 'price_desc' | 'newest';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'attendee' | 'organizer';
  avatar: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalTicketsSold: number;
  totalEvents: number;
  activeAttendees: number;
  categoryBreakdown: { category: string; count: number; revenue: number }[];
  recentBookings: Booking[];
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  description: string;
  minimumSpend: number;
}
