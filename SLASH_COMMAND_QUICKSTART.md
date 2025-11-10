# 5-Minute Quick Start: `/handover` Slash Command

Get Jira tickets with a Slack command!

---

## 🚀 Quick Setup

### 1. Install Flask
```bash
cd /Users/rithytep/jira-slack-integration
pip install flask
```

### 2. Start the Server with ngrok
```bash
chmod +x start_server.sh
./start_server.sh
```

Choose **option 2** (With ngrok)

You'll see output like:
```
ngrok

Session Status    online
Forwarding        https://abc-123-xyz.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL!** (e.g., `https://abc-123-xyz.ngrok-free.app`)

---

### 3. Create Slack Slash Command

1. Go to: https://api.slack.com/apps

2. **Create New App**:
   - Click "Create New App" → "From scratch"
   - Name: `Jira Handover Bot`
   - Select your workspace
   - Click "Create App"

3. **Add Slash Command**:
   - Left sidebar → "Slash Commands"
   - Click "Create New Command"

   Fill in:
   - **Command**: `/handover`
   - **Request URL**: `https://YOUR-NGROK-URL.ngrok-free.app/slack/handover`
     - Example: `https://abc-123-xyz.ngrok-free.app/slack/handover`
   - **Short Description**: `Show TCP pending tickets`
   - **Usage Hint**: `(shows pending tickets)`

   - Click "Save"

4. **Install to Workspace**:
   - Left sidebar → "Install App"
   - Click "Install to Workspace"
   - Click "Allow"

---

### 4. Test It!

Go to any Slack channel and type:
```
/handover
```

You should see all TCP tickets! 🎉

---

## 📝 What You Get

```
📋 TCP Handover Report - 13 Tickets

1. TCP-84057 - WE368 [20158] - Bank information confirming
   📊 Status: WL - Pending | 👤 Assignee: John Doe
   ⚡ Action: Can check tomorrow

2. TCP-84365 - Saffaluck [20154] - GA4 privacy request
   📊 Status: WL - Processing | 👤 Assignee: Jane Smith
   ⚡ Action: Can check tomorrow

... (11 more tickets)
```

---

## ⚙️ Configuration

### Show Only to You (Private)

Edit `slack_slash_command.py` line 72:
```python
"response_type": "ephemeral"  # Only you see it
```

### Show to Everyone

```python
"response_type": "in_channel"  # Everyone sees it
```

### Change Query

Edit `slack_slash_command.py` line 22:
```python
JQL_QUERY = """
project = TCP
AND assignee = currentUser()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC
"""
```

---

## 🐛 Troubleshooting

### Command doesn't appear
- Wait 1-2 minutes
- Type `/` in Slack to see all commands
- Reinstall the app

### "dispatch_failed" error
- Check server is running: `curl http://localhost:3000/health`
- Verify ngrok URL is correct (check ngrok terminal)
- Make sure URL includes `/slack/handover` at the end

### ngrok "Visit Site" warning
- Normal for free ngrok accounts
- Click "Visit Site" to proceed
- Or upgrade ngrok / use production deployment

---

## 🎯 Keep It Running

### Option 1: Keep terminals open
- Terminal 1: Flask server
- Terminal 2: ngrok tunnel

### Option 2: Deploy to cloud
See `SLASH_COMMAND_SETUP.md` for Heroku, AWS, Railway options

---

## ✅ Quick Check

```bash
# Test server is running:
curl http://localhost:3000/health

# Should return:
{"status":"ok","message":"Server is running"}
```

---

**That's it! Type `/handover` in Slack to see your tickets!** 🚀

Full documentation: `SLASH_COMMAND_SETUP.md`
