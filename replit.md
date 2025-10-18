# Co-Parent Message Moderator

## Overview
An SMS-based AI-powered message moderation system for high-conflict co-parents. The app intercepts messages sent between co-parents via Twilio, analyzes them using OpenAI for emotional or negative content, and either forwards appropriate messages or sends constructive feedback to the sender explaining why the message was blocked.

## Recent Changes (Latest Session)
- **2025-01-18**: Initial MVP implementation complete
  - Created complete data schema with messages and parent pairs tables
  - Implemented Twilio SMS webhook integration for receiving incoming messages
  - Integrated OpenAI GPT-4o-mini for AI-powered content moderation
  - Built comprehensive dashboard UI with message cards, stats, and filtering
  - Added parent pair management system to route messages correctly
  - Fixed critical bug: Messages now forward to actual co-parent recipient instead of Twilio number
  - Added dark mode support with theme toggle

## Architecture

### Frontend (React + TypeScript)
- **Dashboard**: Main view showing message activity, statistics, and parent pair management
- **Components**:
  - `MessageCard`: Displays message with status (approved/blocked/pending), moderation feedback
  - `StatsCard`: Shows key metrics (total messages, approved, blocked, block rate)
  - `ParentPairManager`: UI for registering co-parent phone number pairs
  - `ThemeProvider` + `ThemeToggle`: Dark/light mode support
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS + Shadcn UI components following calm, professional design guidelines

### Backend (Express + Node.js)
- **Twilio Integration**: 
  - Webhook endpoint at `/api/sms/webhook` receives incoming SMS
  - Uses Replit Twilio connection for secure credential management
  - Sends feedback SMS to senders and forwards approved messages to recipients
- **OpenAI Integration**:
  - Uses Replit AI Integrations (no API key needed, billed to Replit credits)
  - GPT-4o-mini analyzes message tone, detects emotional/hostile content
  - Returns structured moderation results with issues, suggestions, severity
- **Storage**: In-memory storage (MemStorage) for MVP
  - Messages: fromPhone, toPhone, recipientPhone, content, status, moderationResult, feedback
  - Parent Pairs: phone1, phone2 (bidirectional lookup for message routing)

### Data Flow
1. Co-parent sends SMS to Twilio number
2. Twilio webhook delivers message to `/api/sms/webhook`
3. System looks up recipient using parent pair registry
4. If no pair found, sender receives registration error message
5. OpenAI analyzes message content for appropriateness
6. If appropriate: Message forwarded to co-parent recipient, stored as "approved"
7. If inappropriate: Constructive feedback sent to sender, stored as "blocked"
8. Dashboard displays all messages with real-time stats and filtering

## Key Features Implemented
✅ Twilio SMS webhook integration to receive incoming messages
✅ AI-powered content moderation using OpenAI to analyze tone and content
✅ Automatic message blocking for emotional, negative, or inappropriate content
✅ SMS response to sender with detailed feedback and suggestions
✅ Message forwarding to recipient when content passes moderation
✅ Dashboard to view moderation activity with filtering (all/approved/blocked/pending)
✅ Parent pair management system to route messages correctly
✅ Statistics widgets showing moderation effectiveness
✅ Dark mode support
✅ Beautiful empty states, loading skeletons, and error handling

## Setup Instructions

### Prerequisites
- Replit account with Twilio connection configured
- Twilio phone number configured with webhook pointing to your Replit app
- Replit AI Integrations enabled (for OpenAI access)

### Environment Variables
The following are managed automatically by Replit integrations:
- `AI_INTEGRATIONS_OPENAI_API_KEY`: Auto-configured by Replit AI Integrations
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Auto-configured by Replit AI Integrations
- Twilio credentials: Managed by Replit Twilio connection

### Initial Setup
1. Configure Twilio webhook to point to: `https://your-replit-app.replit.dev/api/sms/webhook`
2. Register parent pairs through the dashboard UI:
   - Enter both co-parent phone numbers (in E.164 format, e.g., +1234567890)
   - Click "Create Parent Pair"
3. Test by sending an SMS from one of the registered numbers to your Twilio number

## API Endpoints

### Messages
- `GET /api/messages` - Retrieve all messages (sorted by newest first)

### Parent Pairs
- `GET /api/parent-pairs` - Get all registered parent pairs
- `POST /api/parent-pairs` - Create new parent pair
  - Body: `{ "phone1": "+1234567890", "phone2": "+0987654321" }`

### Webhooks
- `POST /api/sms/webhook` - Twilio webhook for incoming SMS
  - Expects Twilio webhook payload: `From`, `To`, `Body`

## User Preferences
- Design: Calm, professional Material Design aesthetic with trustworthy blue primary color
- Typography: Inter for UI, JetBrains Mono for message content and phone numbers
- Color scheme: Soft backgrounds with clear status indicators (green=approved, red=blocked, yellow=pending)
- Layout: Clean dashboard with statistics at top, parent pair management, then message activity feed

## Testing the Application

### Manual Testing Steps
1. **Register Parent Pairs**: Add two phone numbers through the dashboard
2. **Send Test Messages**:
   - Appropriate message: "Can you pick up Sarah at 3pm today?"
   - Inappropriate message: "You're always late! I'm sick of your excuses!"
3. **Verify Behavior**:
   - Appropriate messages should be forwarded to co-parent
   - Inappropriate messages should be blocked with feedback to sender
   - Dashboard should update with message status and stats

### Expected Moderation Behaviors
- **Approved**: Factual, respectful, child-focused messages
- **Blocked**: Messages containing insults, blame, sarcasm, passive-aggression, threats, guilt-tripping, emotional manipulation

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── message-card.tsx
│   │   │   ├── stats-card.tsx
│   │   │   ├── parent-pair-manager.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── ui/ (shadcn components)
│   │   ├── pages/
│   │   │   ├── dashboard.tsx
│   │   │   └── not-found.tsx
│   │   └── App.tsx
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── twilio-client.ts
│   └── openai-client.ts
└── shared/
    └── schema.ts
```

## Future Enhancements (Planned)
- Message rewrite suggestions that sender can approve and send
- Detailed moderation logs with category breakdown
- Allowlist for time-sensitive topics that bypass moderation
- Configurable moderation sensitivity levels per parent pair
- PostgreSQL persistence for production use
