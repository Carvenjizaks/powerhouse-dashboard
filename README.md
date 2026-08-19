# ⚡ Carvenjizaks's Personal Dashboard

> **UI in Vercel** | **Database code in Claude Code / OpenClaw**

## Architecture

```
┌────────────────────────────────────────┐
│  Vercel (Next.js)                      │
│  ┌──────────────────┐                  │
│  │ Frontend (UI)    │                  │
│  │ Dashboard        │                  │
│  └──────┬───────────┘                  │
│  ┌──────▼───────────┐                  │
│  │ API Routes       │                  │
│  │ /api/tasks       │                  │
│  │ /api/daily-log   │                  │
│  │ /api/progress    │                  │
│  │ /api/recommend   │                  │
│  └──────┬───────────┘                  │
└─────────┼──────────────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│  Neon Postgres (shared database)       │
│  Free tier: 0.5GB, 100h compute/month  │
└─────────▲──────────────────────────────┘
          │
┌─────────┴──────────────────────────────┐
│  OpenClaw / Claude Code                │
│  ┌─────────────────────────────────┐   │
│  │ • Database migrations & seeds   │   │
│  │ • Cron: 6AM reminder emails     │   │
│  │ • Cron: 9PM review emails       │   │
│  │ • Smart recommendation engine   │   │
│  │ • Weekly analytics              │   │
│  └─────────────────────────────────┘   │
└────────────────────────────────────────┘
```

## Setup

### 1. Deploy to Vercel

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USER/powerhouse-dashboard.git
git push -u origin main
```

1. Import the repo into Vercel
2. Add **Neon Postgres** integration (free at neon.tech)
3. Set environment variable: `DATABASE_URL` (from Neon)
4. Deploy

### 2. Run Database Migration (from OpenClaw)

```bash
cd /root/.openclaw/workspace/powerhouse-dashboard

# Set the DATABASE_URL (from Neon dashboard)
export DATABASE_URL="postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Create tables
npx tsx scripts/migrate-pg.ts

# Seed initial data
npx tsx scripts/seed-pg.ts
```

### 3. Cron Jobs (OpenClaw)

The cron jobs are already running on OpenClaw:

| Time | Script | What |
|------|--------|------|
| 6:00 AM | `powerhouse_morning.sh` | Send checklist email |
| 9:00 PM | `powerhouse_evening.sh` | Send review email |

## Local Development

```bash
# Start the API server (OpenClaw side)
cd /root/.openclaw/workspace/powerhouse-backend
npm run start

# In another terminal, start the Next.js dev server
cd /root/.openclaw/workspace/powerhouse-dashboard
npm run dev
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET | Get 5 tasks with today's completion status |
| `/api/daily-log` | POST | Toggle task completion (body: `{taskId, completed}`) |
| `/api/daily-log?start=X&end=Y` | GET | Get logs for a date range |
| `/api/progress` | GET | Week chart, month stats, streak, book deadline |
| `/api/recommendations` | GET | Smart insights based on patterns |

## Database Code (Claude Code Side)

All database management lives in the `scripts/` directory:

| Script | Purpose |
|--------|---------|
| `scripts/migrate-pg.ts` | Create Postgres tables |
| `scripts/seed-pg.ts` | Seed initial data (5 tasks, settings) |
| `scripts/remind_morning.ts` | 6AM email reminder |
| `scripts/remind_evening.ts` | 9PM email review |
| `scripts/generate_recommendations.ts` | Smart recommendation engine |

## 5 Daily Tasks

### ⚡ Powerhouse
- **a) LeadersLAB** — Select and train new leaders
- **b) Powerhouse Academy** — Plan, organize, setup & launch
- **c) Discipleship + Demonstration** — Intentional one-on-one

### 🧑 Personal
- **d) Read 1hr + Write 1 Chapter** — 2 books by 30 Nov 2026 🎯
- **e) Exercise 1.5hr** — 4-5 days per week