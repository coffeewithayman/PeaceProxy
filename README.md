# PeaceProxy

An SMS-based AI-powered message moderation system for high-conflict co-parents. The app intercepts messages sent between co-parents via Twilio, analyzes them using OpenAI for emotional or negative content, and either forwards appropriate messages or sends constructive feedback to the sender.

## Features

- **AI-Powered Moderation**: GPT-4o-mini analyzes messages for emotional, hostile, or inappropriate content
- **Automatic Blocking**: Inappropriate messages are blocked with constructive feedback sent to the sender
- **Message Forwarding**: Approved messages are forwarded to the co-parent recipient
- **Dashboard**: Real-time view of message activity with filtering and statistics
- **Parent Pair Management**: Register co-parent phone number pairs for message routing
- **Dark Mode**: Full dark/light theme support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express, Drizzle ORM, PostgreSQL
- **External Services**: OpenAI GPT-4o-mini, Twilio SMS

## Local Development

```bash
# Install dependencies
npm install

# Start development server (port 5000)
npm run dev

# Type checking
npm run check

# Production build
npm run build

# Start production server
npm run start
```

## Deploying to Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A PostgreSQL database (recommended: [Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres))
3. [Twilio](https://twilio.com) account with a phone number
4. [OpenAI](https://platform.openai.com) API key

### Step 1: Prepare the Project

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" }
  ],
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### Step 2: Create Vercel Serverless API Handler

Create `api/index.js`:

```javascript
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
await registerRoutes(app);

export default app;
```

### Step 3: Update Storage for PostgreSQL

The app currently uses in-memory storage which won't persist in serverless environments. Update `server/storage.ts` to use Drizzle ORM with your PostgreSQL database:

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

Then implement the `IStorage` interface using Drizzle queries instead of the in-memory arrays.

### Step 4: Configure Environment Variables

In your Vercel project settings, add these environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number (E.164 format) |

### Step 5: Update OpenAI Client

Modify `server/openai-client.ts` to use standard OpenAI configuration:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Step 6: Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Step 7: Configure Twilio Webhook

After deployment, update your Twilio phone number's webhook URL:

1. Go to [Twilio Console](https://console.twilio.com) → Phone Numbers → Manage → Active Numbers
2. Select your phone number
3. Under "Messaging Configuration", set the webhook URL to:
   ```
   https://your-app.vercel.app/api/sms/webhook
   ```
4. Set HTTP method to `POST`

### Step 8: Initialize Database

Run Drizzle migrations to create the database tables:

```bash
npm run db:push
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get all moderated messages |
| GET | `/api/parent-pairs` | List registered parent pairs |
| POST | `/api/parent-pairs` | Register a new parent pair |
| POST | `/api/sms/webhook` | Twilio incoming SMS webhook |

## How It Works

1. **Registration**: Register co-parent phone number pairs through the dashboard
2. **Message Reception**: Co-parent sends SMS to the Twilio number
3. **AI Analysis**: Message is analyzed by GPT-4o-mini for tone and content
4. **Routing Decision**:
   - **Appropriate**: Message forwarded to co-parent, marked as "approved"
   - **Inappropriate**: Constructive feedback sent to sender, marked as "blocked"
5. **Dashboard**: View all messages with status, filtering, and statistics

## License

MIT
