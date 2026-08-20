EventPulse – Event Booking Platform
A full‑stack event discovery and ticket booking application built with React, TypeScript, Express, and Vite.
Organizers can create events, manage ticket tiers, apply promo codes, and track sales, while attendees can browse, bookmark, and book tickets instantly.

https://via.placeholder.com/1200x400?text=EventPulse+Demo

🚀 Live Demo
The app is deployed on Render:
👉 https://eventpulse.onrender.com (replace with your actual URL)

✨ Features
Event Discovery – Search, filter by category, format (in‑person / online / hybrid), date, price, and sort by popularity or date.

Detailed Event Pages – View schedule, speakers, venue map, FAQs, and a countdown timer.

Ticket Booking – Select ticket tiers, add optional add‑ons, apply promo codes, and complete a simulated checkout.

Booking Management – View your purchased tickets, download printable passes, and cancel bookings (with seat restoration).

Organizer Dashboard – Admin stats (revenue, tickets sold, category breakdown), manage events (create, delete), and view recent bookings.

Promo Code Engine – Built‑in validation with percentage discounts and minimum spend rules.

Dark/Light Mode – Toggle theme for comfortable browsing.

Responsive Design – Works on desktop, tablet, and mobile.

🛠️ Tech Stack
Frontend	Backend	Build & Deployment
React 19	Express 4	Vite
TypeScript	Node.js 22	esbuild (server bundle)
Tailwind CSS 4	In‑memory database (mock)	Render / Railway
Lucide Icons	REST API	Git / GitHub
Motion (animations)	–	–
📋 Prerequisites
Node.js 18+ and npm (or bun)

A GitHub account (for deployment)

(Optional) Gemini API key for AI features – not required for core booking

🧰 Local Setup
Clone the repository

bash
git clone https://github.com/yourusername/eventpulse.git
cd eventpulse
Install dependencies

bash
npm install
Set environment variables (optional)
Create a .env.local file in the root:

text
GEMINI_API_KEY=your_api_key_here
Run the development server

bash
npm run dev
The app will be available at http://localhost:3000.

🔗 API Endpoints
All endpoints are prefixed with /api.

Method	Endpoint	Description
GET	/events	Get events with filtering & sorting
GET	/events/:id	Get a single event by ID or slug
POST	/events	Create a new event (organizer only)
PUT	/events/:id	Update an event
DELETE	/events/:id	Delete an event
POST	/promo/validate	Validate a promo code against a subtotal
POST	/bookings	Create a new booking
GET	/bookings	Get bookings (optionally by email or eventId)
GET	/bookings/:id	Get a single booking receipt
POST	/bookings/:id/cancel	Cancel a booking and restore seats
GET	/admin/stats	Get admin statistics (revenue, tickets sold, etc.)
GET	/categories	List all categories with event counts
🚢 Deployment
Deploy to Render (recommended)
Push your code to a GitHub repository.

Sign up at render.com and create a new Web Service.

Connect your GitHub repo and use these settings:

Build Command: npm install && npm run build

Start Command: npm start

Add any environment variables (like GEMINI_API_KEY) if needed.

Click Deploy – Render will build and host your app.

Deploy to Railway
Similar steps – use the same build and start commands.

Deploy to Vercel (frontend only)
For Vercel, you would need to separate the backend into serverless functions. This project is designed as a single server, so Render or Railway are easier choices.

🧪 Testing Promo Codes
Use these built‑in promo codes during checkout:

Code	Discount	Min Spend	Description
EARLYBIRD20	20% (up to $50)	$30	Early bird discount
TECHCON10	10% (up to $30)	$20	Tech conference discount
STUDENT50	50% (up to $40)	$20	Student discount
PULSEVIP	15% (up to $100)	$50	VIP welcome discount
📁 Project Structure
text
eventpulse/
├── server.ts               # Express server with Vite middleware
├── data.ts                 # In‑memory database (DatabaseStore)
├── src/
│   ├── types/              # TypeScript interfaces
│   ├── data/               # Mock events and promo codes
│   ├── services/           # API client (api.ts)
│   ├── components/         # React components (Navbar, EventCard, etc.)
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
└── .gitignore              # Ignored files
🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🙏 Acknowledgements
Unsplash for placeholder images

Lucide Icons for clean icons

Tailwind CSS for utility-first styling

Happy event planning! 🎉