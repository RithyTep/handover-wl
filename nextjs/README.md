# Jira Handover Dashboard - Next.js

A modern, responsive Next.js application for managing Jira ticket handovers with Slack integration.

## Features

- **Real-time Jira Integration**: Fetch tickets directly from Jira using JQL queries
- **Interactive Dashboard**: Edit ticket status and actions with a clean, intuitive UI
- **Slack Integration**: Send handover reports directly to Slack channels
- **Responsive Design**: Fully mobile-responsive with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components and Sonner toasts
- **Type-Safe**: Written in TypeScript for better development experience

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui inspired components
- **Icons**: Lucide React
- **Notifications**: Sonner
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ and npm
- Jira account with API token
- Slack webhook URL

## Getting Started

### 1. Clone and Navigate

```bash
cd nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Jira Configuration
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token

# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

#### How to get Jira API Token:
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name and copy the token

#### How to get Slack Webhook URL:
1. Go to https://api.slack.com/apps
2. Create a new app or select existing
3. Enable "Incoming Webhooks"
4. Add new webhook to workspace
5. Copy the webhook URL

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
nextjs/
├── app/
│   ├── api/
│   │   ├── tickets/         # Fetch Jira tickets
│   │   ├── save/            # Save ticket data
│   │   └── send-slack/      # Send to Slack
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   └── ui/
│       ├── button.tsx       # Button component
│       └── dialog.tsx       # Dialog component
├── public/                  # Static files
├── .env.local              # Environment variables
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## Usage

### Dashboard Features

1. **View Tickets**: All Jira tickets matching your JQL query are displayed
2. **Edit Fields**: Click on any Status or Action cell to edit
3. **Quick Fill**: Fill all tickets with the same status/action
4. **Clear All**: Clear all status and action fields
5. **Save**: Save changes locally without sending to Slack
6. **Send to Slack**: Save and post handover report to Slack
7. **Refresh**: Reload tickets from Jira

### Customizing JQL Query

Edit the JQL query in `app/api/tickets/route.ts`:

```typescript
const JQL_QUERY = `
project = YOUR_PROJECT
AND issuetype in standardIssueTypes()
AND status in ("Status 1", "Status 2")
ORDER BY created ASC
`;
```

### Keyboard Shortcuts

- **Enter**: Save changes in edit dialog
- **Escape**: Close dialogs

## API Endpoints

- `GET /api/tickets` - Fetch tickets from Jira
- `POST /api/save` - Save ticket data
- `POST /api/send-slack` - Save and send to Slack

## Responsive Design

The dashboard is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
