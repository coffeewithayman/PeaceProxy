# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PeaceProxy is an SMS-based AI-powered message moderation system for high-conflict co-parents. It intercepts SMS messages via Twilio, analyzes them using OpenAI GPT-4o-mini for emotional/negative content, and either forwards appropriate messages or sends constructive feedback to the sender.

## Commands

```bash
npm run dev          # Development server (port 5000, auto-reload)
npm run build        # Production build (Vite client + esbuild server)
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run db:push      # Drizzle ORM migrations (requires DATABASE_URL)
```

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript, Vite, TanStack Query, Tailwind CSS + shadcn/ui, Wouter router
- **Backend**: Express, Drizzle ORM (PostgreSQL-ready), Passport.js
- **External**: OpenAI GPT-4o-mini (via Replit AI Integrations), Twilio SMS

### Project Structure
```
client/src/
├── components/     # UI components (message-card, stats-card, parent-pair-manager)
│   └── ui/         # shadcn/ui components
├── pages/          # Dashboard and 404 pages
├── hooks/          # Custom React hooks
└── lib/            # Query client and utilities

server/
├── index.ts        # Express server entry
├── routes.ts       # API endpoints + Twilio webhook
├── storage.ts      # In-memory storage (IStorage interface)
├── openai-client.ts # AI moderation logic
└── twilio-client.ts # SMS sending

shared/
└── schema.ts       # Drizzle tables + Zod schemas
```

### Data Flow
1. SMS arrives at Twilio number → POST to `/api/sms/webhook`
2. System looks up recipient via parent pairs registry
3. OpenAI analyzes message content
4. Appropriate: forward to co-parent, store as "approved"
5. Inappropriate: send feedback to sender, store as "blocked"

### API Endpoints
- `GET /api/messages` - All moderated messages
- `GET /api/parent-pairs` - List registered pairs
- `POST /api/parent-pairs` - Register co-parent pair
- `POST /api/sms/webhook` - Twilio incoming SMS webhook

## Key Implementation Details

### Storage
Currently uses in-memory storage (`MemStorage`). PostgreSQL-ready via Drizzle ORM schema in `shared/schema.ts`. To switch: implement `IStorage` interface with Drizzle queries.

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`

### Message Status
`"approved" | "blocked" | "pending"` - simple enum pattern in schema

### Styling
Tailwind CSS with CSS variables for theming. Dark mode via `dark:` prefix (class-based). Colors use HSL format defined in `client/src/index.css`.

## Environment Variables (Managed by Replit)
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Auto-configured
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - Auto-configured
- Twilio credentials - Managed via Replit integration
- `DATABASE_URL` - Required for PostgreSQL (not yet in use)
