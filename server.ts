import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get all events with filtering & sorting
  app.get('/api/events', (req, res) => {
    try {
      const { search, category, format, dateRange, priceRange, sortBy, featured } = req.query;
      const events = db.getEvents({
        search: search as string,
        category: category as string,
        format: format as string,
        dateRange: dateRange as string,
        priceRange: priceRange as string,
        sortBy: sortBy as string,
        featured: featured as string,
      });
      res.json({ success: true, count: events.length, data: events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get single event
  app.get('/api/events/:id', (req, res) => {
    try {
      const event = db.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.json({ success: true, data: event });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create new event (Admin / Organizer)
  app.post('/api/events', (req, res) => {
    try {
      const newEvent = db.createEvent(req.body);
      res.status(201).json({ success: true, data: newEvent });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Update event
  app.put('/api/events/:id', (req, res) => {
    try {
      const updated = db.updateEvent(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Delete event
  app.delete('/api/events/:id', (req, res) => {
    try {
      const success = db.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      res.json({ success: true, message: 'Event successfully removed' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Validate Promo Code
  app.post('/api/promo/validate', (req, res) => {
    try {
      const { code, subtotal } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Promo code is required.' });
      }
      const result = db.validatePromo(code, Number(subtotal) || 0);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create Ticket Booking
  app.post('/api/bookings', (req, res) => {
    try {
      const { eventId, tierId, quantity, attendee, selectedAddOns, promoCode, paymentMethod } = req.body;

      if (!eventId || !tierId || !quantity || !attendee?.fullName || !attendee?.email) {
        return res.status(400).json({
          success: false,
          error: 'Missing required booking information. Please complete all fields.',
        });
      }

      const result = db.createBooking({
        eventId,
        tierId,
        quantity: Number(quantity),
        attendee,
        selectedAddOns,
        promoCode,
        paymentMethod: paymentMethod || 'card',
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get user bookings
  app.get('/api/bookings', (req, res) => {
    try {
      const { email, eventId } = req.query;
      const bookings = db.getBookings({
        email: email as string,
        eventId: eventId as string,
      });
      res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get single booking receipt
  app.get('/api/bookings/:id', (req, res) => {
    try {
      const booking = db.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }
      res.json({ success: true, data: booking });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Cancel booking
  app.post('/api/bookings/:id/cancel', (req, res) => {
    try {
      const result = db.cancelBooking(req.params.id);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin stats
  app.get('/api/admin/stats', (req, res) => {
    try {
      const stats = db.getAdminStats();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Categories list & counts
  app.get('/api/categories', (req, res) => {
    try {
      const events = db.getEvents();
      const categoryCounts: Record<string, number> = {};
      events.forEach((e) => {
        categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
      });

      const categories = [
        { name: 'All', count: events.length, icon: 'LayoutGrid' },
        { name: 'Music & Concerts', count: categoryCounts['Music & Concerts'] || 0, icon: 'Music' },
        { name: 'Tech & Conferences', count: categoryCounts['Tech & Conferences'] || 0, icon: 'Cpu' },
        { name: 'Workshops & Masterclasses', count: categoryCounts['Workshops & Masterclasses'] || 0, icon: 'Sparkles' },
        { name: 'Festivals & Arts', count: categoryCounts['Festivals & Arts'] || 0, icon: 'Film' },
        { name: 'Sports & Fitness', count: categoryCounts['Sports & Fitness'] || 0, icon: 'Trophy' },
        { name: 'Business & Networking', count: categoryCounts['Business & Networking'] || 0, icon: 'Briefcase' },
      ];

      res.json({ success: true, data: categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Vite Middleware Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventPulse Server running on http://localhost:${PORT}`);
  });
}

startServer();
