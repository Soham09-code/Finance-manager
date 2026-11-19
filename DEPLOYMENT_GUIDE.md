# Finance Manager - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account (free)

---

## 1. Set up Neon PostgreSQL (Free Tier)

1. Go to https://console.neon.tech/
2. Sign up / log in
3. Click "Create Project"
4. Choose a name (e.g., "finance-manager")
5. Select a region close to you
6. Click "Create Project"

## 2. Get your DATABASE_URL

After project creation, you'll see a connection string like:
```
postgresql://username:password@ep-xxx-xxx.region.neon.tech/neondb?sslmode=require
```

**Copy this - you'll need it for Vercel and local development.**

## 3. Local Development Setup

```bash
# Clone the repo (if not already)
cd finance-manager

# Install dependencies
npm install

# Create .env file with your Neon connection string
echo 'DATABASE_URL="your-neon-connection-string"' > .env

# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the app.

## 4. Deploy to Vercel

### Option A: GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/finance-manager.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Add Environment Variable:
     - Name: `DATABASE_URL`
     - Value: Your Neon connection string
   - Click Deploy

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (will prompt for project settings)
vercel --prod
```

## 5. Post-deployment: Run Migrations on Production

After first successful deploy:
```bash
# Pull production environment variables
vercel env pull .env.production

# Run migrations against production database
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma migrate deploy
```

---

## Environment Variables Needed for Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon/Postgres connection string |

---

## Project Structure

```
finance-manager/
├── app/
│   ├── api/transactions/route.tsx   # REST API for transactions
│   ├── dashboard/page.tsx           # Dashboard UI
│   ├── lib/prisma.ts                # Prisma client singleton
│   ├── globals.css                  # Tailwind styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── prisma/
│   └── schema.prisma                # Database schema
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## Database Schema

```prisma
model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  password     String
  createdAt    DateTime @default(now())
  transactions Transaction[]
}

model Transaction {
  id           String   @id @default(uuid())
  description  String
  amount       Float
  type         String   // "income" or "expense"
  category     String   // e.g., "salary", "groceries", "rent"
  date         DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
  userId       String
}
```

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Preview production build
npm run start

# Prisma studio (view/edit data)
npx prisma studio

# Run migrations
npx prisma migrate deploy

# Create new migration (after schema changes)
npx prisma migrate dev --name migration_name

# Reset database (dev only!)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

---

## Next Steps / Improvements

- [ ] Add authentication (NextAuth.js)
- [ ] Add user registration/login
- [ ] Associate transactions with authenticated user
- [ ] Add categories management
- [ ] Add charts (Recharts/Chart.js) for spending trends
- [ ] Add budget/targets feature
- [ ] Add data export (CSV/PDF)
- [ ] Add recurring transactions

---

## Troubleshooting

**Build fails with Prisma errors:**
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Run `npx prisma generate` locally before pushing

**Database connection fails:**
- Check Neon dashboard: project must be "Active" (not suspended)
- Verify connection string format includes `?sslmode=require`
- Check IP allowlist in Neon (allow all for Vercel: `0.0.0.0/0`)

**TypeScript errors:**
- Run `npx prisma generate` to regenerate types
- Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"