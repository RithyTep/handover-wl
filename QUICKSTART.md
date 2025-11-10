# Quick Start Guide - 5 Minutes Setup

Get your Jira tickets in Slack in just 5 minutes!

## Prerequisites

- Jira account with admin access (to create API token)
- Slack workspace (to create webhook)
- Python 3.7+ installed

---

## Step 1: Get Jira API Token (2 minutes)

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name: `Slack Integration`
4. Click **Create**
5. **Copy the token** (you won't see it again!)

---

## Step 2: Get Slack Webhook URL (2 minutes)

### For Private Channel:

1. Go to: https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. App Name: `Jira Bot`
4. Select your workspace
5. Click **"Incoming Webhooks"** → Toggle **ON**
6. Click **"Add New Webhook to Workspace"**
7. **Select your private channel** (you must be a member)
8. Click **"Allow"**
9. **Copy the Webhook URL** (starts with `https://hooks.slack.com/services/...`)

---

## Step 3: Setup & Run (1 minute)

### Automated Setup (Recommended):

```bash
cd jira-slack-integration
chmod +x setup.sh
./setup.sh
```

The script will ask you for:
- Jira URL (e.g., `https://yourcompany.atlassian.net`)
- Jira email
- Jira API token
- Slack Webhook URL

### Manual Setup:

```bash
# Install dependencies
pip install -r requirements.txt

# Copy example config
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Edit `.env`:
```env
JIRA_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=ATATT3xFfGF0...your-token-here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx
```

---

## Step 4: Test It!

```bash
python3 jira_to_slack.py
```

You should see:
```
🚀 Starting Jira to Slack integration...
📥 Fetching tickets from Jira...
✅ Found 3 ticket(s)
📤 Posting to Slack...
✅ Message posted to Slack successfully
```

Check your Slack channel - you should see the tickets! 🎉

---

## Step 5: Schedule It (Optional)

### Option A: Using the scheduler script

```bash
chmod +x scheduler.sh
./scheduler.sh
```

Choose option 2 for daily at 9 AM.

### Option B: Manual cron setup

```bash
crontab -e
```

Add this line:
```
0 9 * * * cd /path/to/jira-slack-integration && python3 jira_to_slack.py
```

---

## Troubleshooting

### "No tickets found"

**Fix:** Update the JQL query in `jira_to_slack.py`:

```python
JQL_QUERY = """
project = YOUR_PROJECT_KEY
AND status in ("To Do", "In Progress")
ORDER BY created DESC
"""
```

### "401 Unauthorized"

**Fix:**
- Check your Jira email is correct
- Regenerate API token
- Make sure JIRA_URL doesn't have trailing slash

### "channel_not_found" (Slack)

**Fix for private channels:**
1. Go to your private channel in Slack
2. Type: `/invite @Jira Bot`
3. Press Enter
4. Try again

---

## What's Next?

- ✅ Test it works
- ✅ Schedule it to run automatically
- ✅ Customize the JQL query for your needs
- ✅ Adjust the message format if needed

---

## Common JQL Queries

```python
# Your assigned tickets
"assignee = currentUser() AND status != Done"

# High priority tickets
"priority = High AND status = 'In Progress'"

# Updated today
"updated >= startOfDay()"

# Multiple statuses
"status in ('To Do', 'In Progress', 'In Review')"
```

---

## Support

Need help? Check:
- Full documentation: `README.md`
- Common issues: `README.md` → Troubleshooting section

---

**That's it! You're all set! 🚀**

Your Jira tickets will now appear in your Slack channel automatically!
