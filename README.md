# Jira to Slack Integration

Automatically fetch Jira tickets and post formatted updates to your Slack private channel.

## Features

- ✅ Fetch tickets from Jira using JQL queries
- ✅ Format tickets in your preferred format
- ✅ Post to Slack private channels using Webhook or Bot Token
- ✅ Rich formatting with Slack Block Kit
- ✅ Easy to schedule and automate
- ✅ Secure authentication with API tokens

## Output Example

```
📋 Jira Tickets Update - 2025-01-10 14:30

--- Ticket 1 ---
🔗 Ticket Link: TCP-84057 WE368 [20158] - Bank information confirming
📊 Status: WL - Pending
👤 Assignee: John Doe
⚡ Action: Can check tomorrow

--- Ticket 2 ---
🔗 Ticket Link: TCP-84365 Saffaluck [20154] - GA4 privacy request
📊 Status: WL - Processing
👤 Assignee: Jane Smith
⚡ Action: Can check tomorrow
```

---

## Prerequisites

- Python 3.7 or higher
- Jira account with API token
- Slack workspace with either:
  - Incoming Webhook URL, OR
  - Slack Bot Token

---

## Quick Start (5 Minutes)

### Step 1: Get Your Jira API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **Create API token**
3. Give it a name (e.g., "Slack Integration")
4. Copy the token (save it somewhere safe!)

### Step 2: Get Your Slack Webhook URL

**Option A: Incoming Webhook (Recommended for simplicity)**

1. Go to https://api.slack.com/messaging/webhooks
2. Click **Create New App** → **From scratch**
3. Name it "Jira Bot" and select your workspace
4. Click **Incoming Webhooks** → Turn it **On**
5. Click **Add New Webhook to Workspace**
6. Select your **private channel** (you must be a member)
7. Copy the Webhook URL (looks like: `https://hooks.slack.com/services/T.../B.../...`)

**Option B: Bot Token (For more control)**

1. Go to https://api.slack.com/apps → **Create New App**
2. Choose **From scratch**, name it "Jira Bot"
3. Go to **OAuth & Permissions**
4. Add these scopes:
   - `chat:write`
   - `chat:write.public` (if posting to public channels)
5. Click **Install to Workspace**
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
7. **Important**: Invite the bot to your private channel:
   - In Slack, go to your channel
   - Type: `/invite @Jira Bot`

### Step 3: Install and Configure

1. **Clone/Download this repository**

2. **Navigate to the directory**
   ```bash
   cd jira-slack-integration
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create your .env file**
   ```bash
   cp .env.example .env
   ```

5. **Edit .env file with your credentials**
   ```bash
   nano .env
   # or use your favorite editor
   ```

   **Example .env file:**
   ```env
   # Jira Configuration
   JIRA_URL=https://yourcompany.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=ATATTxxxxxxxxxxxxxxxxxxxxx

   # Slack Configuration (choose one method)
   # Option 1: Webhook URL
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx

   # Option 2: Bot Token (if you prefer)
   # SLACK_BOT_TOKEN=xoxb-your-token-here
   # SLACK_CHANNEL=#your-private-channel
   ```

### Step 4: Test It!

```bash
python jira_to_slack.py
```

You should see:
```
🚀 Starting Jira to Slack integration...
📥 Fetching tickets from Jira...
✅ Found 3 ticket(s)
📤 Posting to Slack...
✅ Message posted to Slack successfully
```

---

## Customization

### Change the JQL Query

Edit the `JQL_QUERY` variable in `jira_to_slack.py`:

```python
JQL_QUERY = """
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
AND assignee = currentUser()
ORDER BY created DESC
"""
```

**Common JQL Examples:**

```python
# All your assigned tickets
"assignee = currentUser() AND status != Done"

# Tickets updated today
"project = TCP AND updated >= startOfDay()"

# High priority tickets
"project = TCP AND priority = High AND status != Done"

# Multiple projects
"project in (TCP, DEV, OPS) AND status = 'In Progress'"
```

### Change Message Format

Edit the `format_slack_blocks()` function to customize the output format.

**Simple text format (without blocks):**

Uncomment these lines in `main()`:
```python
# Option 2: Use simple text format
message = format_ticket_message(tickets)
success = post_to_slack_webhook(message)
```

---

## Automation / Scheduling

### Option 1: Cron Job (Linux/Mac)

Run every day at 9 AM:

```bash
# Edit crontab
crontab -e

# Add this line (adjust path to your script)
0 9 * * * cd /path/to/jira-slack-integration && /usr/bin/python3 jira_to_slack.py >> /tmp/jira-slack.log 2>&1
```

**Common schedules:**
```bash
# Every hour
0 * * * * cd /path/to/jira-slack-integration && python3 jira_to_slack.py

# Every day at 9 AM and 5 PM
0 9,17 * * * cd /path/to/jira-slack-integration && python3 jira_to_slack.py

# Every Monday at 9 AM
0 9 * * 1 cd /path/to/jira-slack-integration && python3 jira_to_slack.py
```

### Option 2: GitHub Actions (Free, Cloud-based)

Create `.github/workflows/jira-to-slack.yml`:

```yaml
name: Jira to Slack

on:
  schedule:
    # Run every day at 9 AM UTC
    - cron: '0 9 * * *'
  workflow_dispatch: # Manual trigger

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run script
        env:
          JIRA_URL: ${{ secrets.JIRA_URL }}
          JIRA_EMAIL: ${{ secrets.JIRA_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: python jira_to_slack.py
```

**Setup:**
1. Push code to GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Add secrets:
   - `JIRA_URL`
   - `JIRA_EMAIL`
   - `JIRA_API_TOKEN`
   - `SLACK_WEBHOOK_URL`

### Option 3: Windows Task Scheduler

1. Open **Task Scheduler**
2. Create Basic Task
3. Trigger: Daily at 9:00 AM
4. Action: Start a program
   - Program: `python`
   - Arguments: `C:\path\to\jira_to_slack.py`
   - Start in: `C:\path\to\jira-slack-integration`

### Option 4: Cloud Functions (AWS Lambda, Google Cloud Functions)

I can provide setup instructions if you need serverless deployment.

---

## Advanced Features

### Filter by Assignee

```python
# In jira_to_slack.py, modify JQL_QUERY:
JQL_QUERY = f"""
project = TCP
AND assignee = "{JIRA_EMAIL}"
AND status in ("WL - Pending", "WL - Processing")
"""
```

### Send to Multiple Channels

```python
# Define multiple webhooks
CHANNELS = {
    'team-a': 'https://hooks.slack.com/services/T.../B.../xxx',
    'team-b': 'https://hooks.slack.com/services/T.../B.../yyy',
}

# Post to each channel
for channel_name, webhook_url in CHANNELS.items():
    post_to_slack_webhook(message, webhook_url)
```

### Add Buttons/Actions

Modify `format_slack_blocks()` to add interactive buttons:

```python
blocks.append({
    "type": "actions",
    "elements": [
        {
            "type": "button",
            "text": {"type": "plain_text", "text": "View in Jira"},
            "url": ticket_url,
            "style": "primary"
        }
    ]
})
```

---

## Troubleshooting

### ❌ Error: "JIRA_API_TOKEN is not set"

**Solution:**
- Make sure `.env` file exists in the same directory
- Check that variables are set correctly (no quotes needed)
- Try exporting manually:
  ```bash
  export JIRA_API_TOKEN="your_token_here"
  python jira_to_slack.py
  ```

### ❌ Error: "401 Unauthorized" from Jira

**Solution:**
- Verify your Jira email is correct
- Regenerate your API token
- Check that your Jira URL is correct (no trailing slash)

### ❌ Error: "channel_not_found" from Slack

**Solution:**
- For **private channels**, you must invite the bot:
  - Go to the channel in Slack
  - Type: `/invite @Jira Bot`
- For **webhook**, make sure you selected the correct channel during setup

### ❌ No tickets found

**Solution:**
- Test your JQL in Jira first:
  - Go to Jira → Filters → Advanced Search
  - Paste your JQL query
  - Verify tickets are returned
- Check the query matches your project/status names exactly

### ❌ Message not formatted correctly

**Solution:**
- Try switching between Block Kit format and simple text format
- Check Slack Block Kit Builder: https://app.slack.com/block-kit-builder

---

## Security Best Practices

- ✅ Never commit `.env` file to git (it's in `.gitignore`)
- ✅ Use environment variables in production
- ✅ Rotate API tokens regularly
- ✅ Use separate tokens for dev/staging/production
- ✅ Restrict Jira API token permissions if possible

---

## File Structure

```
jira-slack-integration/
├── jira_to_slack.py       # Main script
├── requirements.txt       # Python dependencies
├── .env.example          # Configuration template
├── .env                  # Your actual config (not in git)
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── scheduler.sh         # Optional: Scheduling helper
```

---

## Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Enable debug logging:
   ```python
   import logging
   logging.basicConfig(level=logging.DEBUG)
   ```
3. Test components individually:
   - Test Jira API: `curl -u email:token https://yourcompany.atlassian.net/rest/api/3/myself`
   - Test Slack webhook: `curl -X POST -H 'Content-type: application/json' --data '{"text":"Test"}' YOUR_WEBHOOK_URL`

---

## License

MIT License - Feel free to modify and use as needed!

---

## Next Steps

- [ ] Test the integration manually
- [ ] Set up automation (cron/GitHub Actions)
- [ ] Customize JQL query for your needs
- [ ] Add more formatting/filters if needed
- [ ] Share with your team!

---

**Happy automating! 🚀**

If you need help with customization or have questions, feel free to ask!
