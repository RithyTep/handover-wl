# Slack Slash Command Setup Guide

Create a `/handover` command in Slack that shows Jira tickets on-demand!

## 🎯 What You'll Get

Type `/handover` in any Slack channel → Get instant list of TCP tickets!

```
You: /handover

Slackbot:
📋 TCP Handover Report - 13 Tickets

1. TCP-84057 - WE368 [20158] - Bank information confirming
   Status: WL - Pending | Assignee: John Doe
   Action: Can check tomorrow

2. TCP-84365 - Saffaluck [20154] - GA4 privacy request
   Status: WL - Processing | Assignee: Jane Smith
   Action: Can check tomorrow
...
```

---

## 📋 Prerequisites

- Jira credentials (already configured in `.env`)
- Slack workspace admin access (to create slash commands)
- A way to expose your server to the internet:
  - **Option 1**: ngrok (easiest for testing)
  - **Option 2**: Cloud hosting (for production)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd /Users/rithytep/jira-slack-integration
pip install -r requirements.txt
```

### Step 2: Start the Server (Using ngrok for testing)

**Terminal 1** - Start the Flask server:
```bash
python3 slack_slash_command.py
```

You should see:
```
🚀 Starting Slack Slash Command Server
Server will run on: http://0.0.0.0:3000
```

**Terminal 2** - Expose it with ngrok:
```bash
# Install ngrok first if needed:
brew install ngrok

# Or download from: https://ngrok.com/download

# Run ngrok:
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok-free.app`

**Copy this URL!** You'll need it for Slack setup.

---

### Step 3: Create Slack Slash Command

1. **Go to Slack API**: https://api.slack.com/apps

2. **Create New App**:
   - Click **"Create New App"**
   - Choose **"From scratch"**
   - App Name: `Jira Handover Bot`
   - Select your workspace
   - Click **"Create App"**

3. **Create Slash Command**:
   - In the left sidebar, click **"Slash Commands"**
   - Click **"Create New Command"**

   Fill in:
   - **Command**: `/handover`
   - **Request URL**: `https://YOUR-NGROK-URL.ngrok-free.app/slack/handover`
     - Example: `https://abc123.ngrok-free.app/slack/handover`
   - **Short Description**: `Show TCP pending tickets`
   - **Usage Hint**: `(shows pending TCP tickets)`

   - Click **"Save"**

4. **Install App to Workspace**:
   - In the left sidebar, click **"Install App"**
   - Click **"Install to Workspace"**
   - Click **"Allow"**

---

### Step 4: Test It!

Go to any Slack channel and type:
```
/handover
```

You should see the list of TCP tickets! 🎉

---

## 🏗️ Production Deployment

For production use (not just testing), deploy the server to the cloud.

### Option 1: Heroku (Free Tier Available)

**Step 1**: Create `Procfile`:
```bash
cd /Users/rithytep/jira-slack-integration
cat > Procfile << 'EOF'
web: python slack_slash_command.py
EOF
```

**Step 2**: Deploy to Heroku:
```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create jira-handover-bot

# Set environment variables
heroku config:set JIRA_URL=https://olympian.atlassian.net
heroku config:set JIRA_EMAIL=rithy.tep@techbodia.com
heroku config:set JIRA_API_TOKEN=YOUR_TOKEN_HERE

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a jira-handover-bot
git push heroku main

# Get your app URL
heroku info
```

Your app URL will be like: `https://jira-handover-bot-abc123.herokuapp.com`

**Step 3**: Update Slack Command URL:
- Go back to https://api.slack.com/apps
- Select your app → Slash Commands
- Edit `/handover` command
- Update Request URL to: `https://your-heroku-app.herokuapp.com/slack/handover`
- Save

---

### Option 2: AWS Lambda + API Gateway

Create `lambda_handler.py`:
```python
import json
from slack_slash_command import fetch_jira_tickets, format_slack_response, JQL_QUERY

def lambda_handler(event, context):
    # Parse Slack request
    body = event.get('body', '')

    # Fetch tickets
    tickets = fetch_jira_tickets(JQL_QUERY, max_results=50)

    # Format response
    response = format_slack_response(tickets)

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(response)
    }
```

Deploy using AWS SAM or Serverless Framework.

---

### Option 3: Railway.app (Easiest)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect Flask and deploy
6. Set environment variables in Railway dashboard
7. Get your Railway URL and update Slack

---

### Option 4: Your Own Server (VPS, EC2, etc.)

```bash
# On your server:
cd /path/to/jira-slack-integration

# Install dependencies
pip3 install -r requirements.txt

# Install gunicorn (production WSGI server)
pip3 install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:3000 slack_slash_command:app

# Or use systemd service for auto-restart
sudo nano /etc/systemd/system/jira-slack.service
```

**systemd service file**:
```ini
[Unit]
Description=Jira Slack Slash Command
After=network.target

[Service]
User=youruser
WorkingDirectory=/path/to/jira-slack-integration
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/gunicorn -w 4 -b 0.0.0.0:3000 slack_slash_command:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable jira-slack
sudo systemctl start jira-slack
sudo systemctl status jira-slack
```

---

## 🔧 Customization

### Change Response Visibility

Edit `slack_slash_command.py`, line 72:

```python
# Show to everyone in channel:
"response_type": "in_channel"

# OR show only to you (private):
"response_type": "ephemeral"
```

### Add More Commands

Add new routes:

```python
@app.route('/slack/pending', methods=['POST'])
def pending_command():
    """Handle /pending command - show only WL-Pending"""
    jql = """
    project = TCP
    AND status = "WL - Pending"
    ORDER BY created ASC
    """
    tickets = fetch_jira_tickets(jql)
    return jsonify(format_slack_response(tickets))
```

Then create `/pending` command in Slack pointing to `/slack/pending`.

### Change Query

Edit the `JQL_QUERY` variable in `slack_slash_command.py`:

```python
JQL_QUERY = """
project = TCP
AND assignee = currentUser()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC
"""
```

---

## 🔐 Security (Important!)

### Add Slack Signature Verification

Update `.env`:
```env
SLACK_SIGNING_SECRET=your_signing_secret_from_slack
```

Add verification in `slack_slash_command.py`:

```python
import hmac
import hashlib
import time

def verify_slack_request(request):
    """Verify request is from Slack"""
    slack_signature = request.headers.get('X-Slack-Signature', '')
    slack_timestamp = request.headers.get('X-Slack-Request-Timestamp', '')

    # Check timestamp (prevent replay attacks)
    if abs(time.time() - int(slack_timestamp)) > 60 * 5:
        return False

    # Verify signature
    sig_basestring = f"v0:{slack_timestamp}:{request.get_data().decode()}"
    my_signature = 'v0=' + hmac.new(
        SLACK_SIGNING_SECRET.encode(),
        sig_basestring.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(my_signature, slack_signature)

@app.route('/slack/handover', methods=['POST'])
def handover_command():
    # Verify request
    if not verify_slack_request(request):
        return jsonify({"error": "Invalid signature"}), 403

    # ... rest of code
```

Get Signing Secret:
1. Go to https://api.slack.com/apps
2. Select your app
3. Go to **"Basic Information"**
4. Copy **"Signing Secret"**

---

## 🐛 Troubleshooting

### Command not showing up
- Wait 1-2 minutes after creating
- Try typing `/` in Slack to see all commands
- Reinstall the app to workspace

### "dispatch_failed" error
- Check your server is running
- Verify ngrok URL is correct
- Test server: `curl https://your-url.ngrok-free.app/health`

### Timeout errors
- Slack expects response within 3 seconds
- If query is slow, return immediate response then post update
- Use delayed response pattern (see Slack docs)

### No tickets showing
- Check server logs: `python3 slack_slash_command.py`
- Test Jira connection: `python3 test_connection.py`
- Verify `.env` file has correct credentials

### ngrok "Visit Site" page
- This is normal for free ngrok accounts
- Users will see a warning page first
- Upgrade to paid ngrok or use alternative tunneling
- Or deploy to production (recommended)

---

## 📊 Monitoring

### View Server Logs

```bash
# Local:
python3 slack_slash_command.py

# Heroku:
heroku logs --tail

# Your server:
journalctl -u jira-slack -f
```

### Test Endpoints

```bash
# Health check:
curl https://your-url/health

# Test handover (simulate Slack):
curl -X POST https://your-url/slack/handover \
  -d "user_name=test&channel_name=general"
```

---

## 🎉 Success Checklist

- [ ] Server is running (locally or cloud)
- [ ] ngrok tunnel is active OR deployed to cloud
- [ ] Slack app created
- [ ] `/handover` slash command created
- [ ] Command URL points to your server
- [ ] App installed to workspace
- [ ] Tested in Slack channel
- [ ] Command returns ticket list
- [ ] (Optional) Added signature verification
- [ ] (Optional) Set up auto-restart/monitoring

---

## 🚀 Next Steps

Once working:
1. Deploy to production (Heroku/Railway/AWS)
2. Remove ngrok dependency
3. Add signature verification for security
4. Create additional commands (`/pending`, `/mytickets`)
5. Add interactive buttons (assign, close, etc.)
6. Set up monitoring/alerts

---

## 💡 Advanced Features

### Interactive Buttons

Add action buttons to tickets:

```python
"accessory": {
    "type": "button",
    "text": {"type": "plain_text", "text": "View"},
    "url": ticket_url,
    "style": "primary"
}
```

### Scheduled Reports

Combine with cron job:
- Manual: `/handover`
- Automatic: Daily at 9 AM (using original script)

### Multiple Projects

Add parameter support:
- `/handover tcp` - TCP project
- `/handover dtcp` - DTCP project
- `/handover all` - All projects

---

**Questions? Issues?**

Check the troubleshooting section or test with:
```bash
python3 test_connection.py
curl http://localhost:3000/health
```

Happy automating! 🎉
