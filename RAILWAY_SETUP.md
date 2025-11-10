# Railway Setup Instructions

## Current Status

The application is deployed at: https://handover-production.up.railway.app/

However, it's showing an error because the PostgreSQL database hasn't been added yet.

## Required Steps

### 1. Add PostgreSQL Database to Railway

1. Go to your Railway dashboard: https://railway.app/
2. Select your project (handover-wl or similar)
3. Click the **"+ New"** button
4. Select **"Database"**
5. Choose **"Add PostgreSQL"**
6. Railway will automatically:
   - Provision a PostgreSQL database
   - Create a `DATABASE_URL` environment variable
   - Link it to your application

### 2. Verify Environment Variables

Make sure these environment variables are set in your Railway project:

- `DATABASE_URL` - (Automatically set when you add PostgreSQL)
- `JIRA_URL` - Your Jira instance URL
- `JIRA_EMAIL` - Your Jira email
- `JIRA_API_TOKEN` - Your Jira API token
- `SLACK_WEBHOOK_URL` - Your Slack webhook URL
- `NODE_ENV` - Should be "production"

### 3. Check Health Status

After adding PostgreSQL, wait for Railway to redeploy (usually 1-2 minutes), then check:

**Health Check Endpoint:**
```bash
curl https://handover-production.up.railway.app/api/health
```

This will show:
- ✓ or ✗ for each environment variable
- Database connection status
- Overall health status

**Expected healthy response:**
```json
{
  "healthy": true,
  "timestamp": "2025-11-10T...",
  "environment": "production",
  "envVars": {
    "DATABASE_URL": "✓ Set",
    "JIRA_URL": "✓ Set",
    "JIRA_EMAIL": "✓ Set",
    "JIRA_API_TOKEN": "✓ Set",
    "SLACK_WEBHOOK_URL": "✓ Set"
  },
  "database": {
    "status": "✓ Connected",
    "type": "PostgreSQL"
  }
}
```

### 4. Test the Application

Once healthy, visit:
- **Main Dashboard:** https://handover-production.up.railway.app/
- **Tickets API:** https://handover-production.up.railway.app/api/tickets

The application should:
- Fetch tickets from Jira
- Display them in the dashboard
- Save status/action selections to PostgreSQL
- Persist data across page refreshes

## Troubleshooting

### If tickets still don't load:

1. Check Railway logs:
   ```bash
   railway logs
   ```

2. Verify Jira credentials are correct

3. Test Jira API access manually:
   ```bash
   curl -u "YOUR_EMAIL:YOUR_API_TOKEN" \
     "https://YOUR_DOMAIN.atlassian.net/rest/api/3/search?jql=project=TCP"
   ```

### If database connection fails:

1. Verify PostgreSQL was added successfully
2. Check `DATABASE_URL` environment variable is set
3. Restart the deployment from Railway dashboard

## Database Schema

The application automatically creates this table on first run:

```sql
CREATE TABLE IF NOT EXISTS ticket_data (
  ticket_key VARCHAR(50) PRIMARY KEY,
  status VARCHAR(100) NOT NULL DEFAULT '--',
  action VARCHAR(100) NOT NULL DEFAULT '--',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

## Architecture

- **Frontend:** Next.js 14 (React) with App Router
- **Backend:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL (Railway)
- **External APIs:** Jira REST API, Slack Webhooks
- **Deployment:** Railway (automatic from GitHub)

## Custom Domain

Your custom domain is configured: https://handover-wl.rithytep.online/

Make sure DNS is pointing to Railway's servers. Check Railway dashboard for DNS settings.
