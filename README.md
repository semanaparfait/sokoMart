# SokoMart 🛍️
Rwanda's local e-commerce platform for small businesses and young entrepreneurs.

## Tech Stack
- **Frontend + Backend**: Next.js 16 (App Router)
- **State Management**: Redux Toolkit + RTK Query
- **Database**: PostgreSQL (Neon serverless)
- **Styling**: Tailwind CSS v4
- **Auth**: bcryptjs (hashed passwords)

## Roles
| Role | Access |
|------|--------|
| **Admin** | Approve/reject products, manage orders & users |
| **Seller** | List products (pending admin approval), view orders |
| **Buyer** | Browse, cart, checkout (no account needed) |

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
Create `.env.local`:
```env
DATABASE_URL=your_neon_postgres_connection_string
```

### 3. Initialize database
```bash
npm run db:init
```

### 4. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sokomart.rw | admin123 |
| Seller | jean@sokomart.rw | seller123 |
| Seller | amina@sokomart.rw | seller123 |
| Buyer | patrick@sokomart.rw | buyer123 |

## Deploy to Vercel

See deployment guide below or run:
```bash
npm install -g vercel
vercel
```

Add `DATABASE_URL` in Vercel project settings → Environment Variables.
