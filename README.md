# Veyro - On-Demand Real Estate Platform

India's first on-demand real estate services platform. Book verified agents for showings, tours, and consultations with transparent pricing—no commissions, no long-term contracts.

## Project Overview

Veyro is a Next.js application that connects clients with verified real estate agents for on-demand services. The platform features:

- **Client Dashboard**: Book services, chat with AI assistant, track bookings
- **Agent Portal**: Apply to become an agent, manage service requests
- **Admin Panel**: Manage agents, approve applications, monitor platform activity
- **Real-time Messaging**: Built-in chat system for client-agent communication
- **Payment Processing**: Stripe integration for secure payments and escrow
- **Email Notifications**: Resend integration for transactional emails

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS with custom Veyro brand colors
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Connect & Payment Intents
- **Email**: Resend
- **AI Chat**: OpenAI GPT-4
- **Animations**: GSAP with ScrollTrigger

## Brand Colors

```css
--veyro-neon: #39FF14      /* Primary brand color - neon green */
--veyro-forest: #087A32    /* Secondary - forest green */
--veyro-dark: #013D1F      /* Dark green for text/accents */
--veyro-black: #000101     /* Near-black for text */
--veyro-light: #F5F7F5     /* Light background */
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Stripe account
- Resend account

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd re-management
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables (see `.env.example`)

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required variables in `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Resend Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Key Features Implemented

### ✅ Complete Rebrand (PeekAbode → Veyro)
- Updated all references across 19 files
- Integrated 5 brand colors into Tailwind theme
- Updated logos and brand assets

### ✅ Design System Overhaul
- Replaced 196+ hardcoded hex colors with semantic Tailwind utilities
- Consistent color usage across 49 TSX files
- Light-mode first design approach

### ✅ Modern Landing Page
- Bento grid layout for services showcase
- GSAP parallax scrolling effects
- Animated stats counters
- Consolidated all pages into single-page design
- How It Works section with step-by-step process visualization
- Coverage map showing 15+ cities
- FAQ accordion
- Lucide React icons throughout (no emojis)

### ✅ Indianization
- Locations: Mumbai, Delhi NCR, Bangalore, Hyderabad, Pune, Chennai
- Currency: ₹ (INR) instead of $
- Pricing converted to Indian market rates
- PIN codes instead of ZIP codes
- Indian states and cities in forms

### ✅ AI Assistant Redesign
- Left sidebar with conversation management
- Multi-conversation support with tabs
- Chat history list
- Previous bookings display (last 5 with status)
- Messages with timestamps and thinking states
- Auto-scroll to latest message
- Suggestion chips with icons
- Glowing input bar on focus

### ✅ Enhanced Service Request Modal
- Increased width (max-w-2xl)
- Grouped sections with headers
- Better form layout with grid alignment
- Success state with confirmation
- Summary pill showing booking details
- Improved validation and error display

### ✅ Authentication & Authorization
- Auth guards on API routes
- Role-based access (client/agent/admin)
- Ownership validation for requests
- Secure session management

### ✅ Email System (Resend)
- Agent application confirmation
- Agent approval notification
- Agent rejection notification
- Booking confirmation for clients
- Admin alerts for new applications

### ✅ Bug Fixes
- Fixed `₹{id}` template literal in admin agents page
- Fixed field name mismatches (zip/zipCode/PINCode)
- Fixed GSAP animation bugs (invisible bento cards)
- Fixed text color on dark backgrounds
- Fixed auth checks on request endpoints

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── agent/           # Agent portal pages
│   ├── api/             # API routes
│   │   ├── admin/       # Admin API endpoints
│   │   ├── agent/       # Agent API endpoints
│   │   ├── requests/    # Booking request APIs
│   │   ├── payments/    # Stripe payment APIs
│   │   └── notifications/ # Push notification APIs
│   └── assistant/       # AI chat assistant page
├── components/
│   ├── LandingPage.tsx  # Main landing page
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Footer component
│   ├── ServiceRequestModal.tsx
│   └── ...
├── lib/
│   ├── email.ts         # Email sending utilities
│   ├── stripe.ts        # Stripe helpers
│   └── supabase.ts      # Supabase client
└── styles/
    └── globals.css      # Global styles + brand colors
```

## Recent Updates

### How It Works Section Enhancement (Latest)
**Visual Improvements:**
- Increased vertical padding for more breathing room (py-40)
- Enhanced spacing between elements (mb-24, gap-8)
- Layered gradient backgrounds with floating decorative circles
- Animated connector line between step cards with proper dots

**Card Design:**
- Larger, more prominent cards (rounded-[28px])
- Gradient overlays that appear on hover
- Icon containers with dual gradient backgrounds
- Lift animation on hover (-translate-y-2)
- Color transitions on title hover
- Enhanced shadow system

**Typography & Details:**
- Larger heading (text-7xl) with improved line height
- Better letter spacing on labels (tracking-[0.15em])
- More descriptive card copy
- Animated pulse effect on badge dot
- Professional badge design with backgrounds

**Bottom CTA:**
- Clear call-to-action button
- Arrow animation on hover
- Social proof text above button

## Database Schema

Key tables in Supabase:
- `users` - User accounts (clients, agents, admins)
- `agent_applications` - Agent registration requests
- `service_requests` - Client booking requests
- `messages` - Chat messages between clients and agents
- `notifications` - Push notification logs
- `payment_methods` - Stored Stripe payment methods

## API Routes

### Public
- `POST /api/agent/apply` - Submit agent application

### Authenticated
- `GET /api/requests` - List user's service requests
- `POST /api/requests` - Create new service request
- `GET /api/requests/[id]` - Get request details
- `PATCH /api/requests/[id]` - Update request status
- `POST /api/payments/setup-intent` - Create Stripe setup intent

### Admin Only
- `GET /api/admin/agents` - List all agent applications
- `PATCH /api/admin/agents/[id]` - Approve/reject agent
- `GET /api/admin/sessions` - View active sessions
- `GET /api/support-requests` - View support tickets

## Deployment

The app is configured for Vercel deployment:

```bash
pnpm build
```

Ensure all environment variables are set in Vercel dashboard.

## Next Steps

1. **Set up Resend**: Create account, verify domain, add API key to `.env`
2. **Configure Stripe**: Set up Connect for agent payouts
3. **Add more services**: Expand beyond current 13 services
4. **Analytics**: Add posthog or mixpanel for tracking
5. **Advanced features**: Real-time updates, in-app messaging improvements

---

## Removed Features

The following mobile app features have been removed as Veyro is now web/dashboard-only:

- ❌ Firebase SDK (client & admin)
- ❌ Push notifications (FCM)
- ❌ Mobile service worker
- ❌ `fcmToken` database field
- ❌ Push notification API endpoints

All notifications are now handled via **email only** using Resend.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Connect](https://stripe.com/docs/connect)
- [GSAP Documentation](https://greensock.com/docs/)
