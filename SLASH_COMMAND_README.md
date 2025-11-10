# ✅ Slack Slash Command Created!

I've set up everything you need for the `/handover` command!

---

## 📁 New Files Created

### Main Files:
1. **`slack_slash_command.py`** - Flask server that handles `/handover` command
2. **`start_server.sh`** - Easy script to start the server (with ngrok option)

### Documentation:
3. **`SLASH_COMMAND_QUICKSTART.md`** - 5-minute setup guide (START HERE!)
4. **`SLASH_COMMAND_SETUP.md`** - Complete documentation with deployment options

---

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server

```bash
cd /Users/rithytep/jira-slack-integration
chmod +x start_server.sh
./start_server.sh
```

Choose **option 2** (With ngrok)

You'll get a URL like: `https://abc-123-xyz.ngrok-free.app`

**Keep this terminal open!**

---

### Step 2: Create Slack Command

1. Go to: **https://api.slack.com/apps**

2. Create New App → "From scratch"
   - Name: `Jira Handover Bot`
   - Select your workspace

3. Add Slash Command:
   - Command: `/handover`
   - Request URL: `https://YOUR-NGROK-URL/slack/handover`
   - Save

4. Install to Workspace

---

### Step 3: Test It!

In any Slack channel, type:
```
/handover
```

You'll see all 13 TCP tickets! 🎉

---

## 🎯 What You Get

When you type `/handover` in Slack:

```
📋 TCP Handover Report - 13 Tickets
Found 13 ticket(s) in WL - Pending/Processing status
(Sorted by oldest first)

1. TCP-84057 - WE368 [20158] - Bank information confirming
   📊 Status: WL - Pending | 👤 Assignee: Unassigned
   ⚡ Action: Can check tomorrow

2. TCP-84365 - Saffaluck [20154] - GA4 privacy request
   📊 Status: WL - Pending | 👤 Assignee: Unassigned
   ⚡ Action: Can check tomorrow

... (11 more tickets)
```

Each ticket is **clickable** - opens Jira directly!

---

## ⚙️ Configuration Options

### Show Only to You (Private)

Edit `slack_slash_command.py` line 72:
```python
"response_type": "ephemeral"  # Only you see it
```

### Show to Everyone in Channel

```python
"response_type": "in_channel"  # Everyone sees it (default)
```

### Change Query

Edit line 19:
```python
JQL_QUERY = """
project = TCP
AND assignee = currentUser()  # Only your tickets
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC
"""
```

---

## 🏗️ Deployment Options

### Option 1: Local with ngrok (Testing)
✅ You're using this now!
- Quick to set up
- Free
- Requires keeping terminals open
- ngrok URL changes on restart

### Option 2: Heroku (Production - Free Tier)
- Always running
- Permanent URL
- No terminals needed
- See `SLASH_COMMAND_SETUP.md` for instructions

### Option 3: Railway.app (Easiest Cloud)
- One-click deploy
- Free tier available
- Auto-deploys from GitHub
- See `SLASH_COMMAND_SETUP.md`

### Option 4: Your Own Server
- Full control
- Use gunicorn for production
- See `SLASH_COMMAND_SETUP.md`

---

## 📊 Comparison: Scheduled vs On-Demand

You now have **TWO ways** to get tickets:

### Method 1: Scheduled (Original)
```bash
python3 jira_to_slack.py
```
- **Runs automatically** (daily at 9 AM)
- Posts to channel without asking
- Good for: Daily standup reports

### Method 2: On-Demand (NEW!)
```
/handover
```
- **Runs when you type the command**
- Get latest tickets anytime
- Good for: Ad-hoc checks, handovers

**Best practice**: Use BOTH!
- Scheduled: Daily morning report
- On-demand: Check anytime during day

---

## 🔧 Quick Commands

### Start Server (with ngrok)
```bash
cd /Users/rithytep/jira-slack-integration
./start_server.sh
```

### Test Server Locally
```bash
curl http://localhost:3000/health
```

### Check Logs
The Flask server shows logs in the terminal. Watch for:
```
📥 /handover command from rithy.tep in #general
```

---

## 🐛 Troubleshooting

### `/handover` command doesn't appear
- Wait 1-2 minutes after creating
- Type `/` in Slack to refresh command list
- Reinstall the app to workspace

### "dispatch_failed" error
- Check server is running in terminal
- Verify ngrok URL is correct
- Test: `curl https://your-ngrok-url/health`

### Timeout errors
- Server is too slow (>3 seconds)
- Check Jira API response time
- Consider caching results

### ngrok "Visit Site" warning
- Normal for free ngrok accounts
- Click "Visit Site" to continue
- Or upgrade to paid ngrok ($8/month)
- Or deploy to cloud (Heroku/Railway - free!)

---

## ✅ Next Steps

1. ✅ **Test locally** with ngrok (you're doing this now!)

2. 🚀 **Deploy to production** when ready:
   - Follow `SLASH_COMMAND_SETUP.md`
   - Heroku, Railway, or AWS
   - Get permanent URL

3. 🔐 **Add security** (recommended):
   - Add Slack signature verification
   - See `SLASH_COMMAND_SETUP.md` → Security section

4. 🎨 **Customize** (optional):
   - Add more commands (`/pending`, `/mytickets`)
   - Change response format
   - Add interactive buttons

5. 📊 **Monitor** (production):
   - Set up logging
   - Add error alerts
   - Track usage

---

## 📚 Documentation

- **Quick Start**: `SLASH_COMMAND_QUICKSTART.md` (5 minutes)
- **Full Guide**: `SLASH_COMMAND_SETUP.md` (complete reference)
- **Original Scheduled Bot**: `README.md`
- **This File**: Overview and quick reference

---

## 🎉 You're All Set!

You now have:
- ✅ Flask server running
- ✅ ngrok tunnel active
- ✅ `/handover` command in Slack
- ✅ Real-time Jira tickets on demand

**Type `/handover` in Slack to test it!** 🚀

---

## 💡 Pro Tips

1. **Keep terminals organized**:
   - Terminal 1: Flask server
   - Terminal 2: ngrok tunnel
   - Terminal 3: Your normal work

2. **Restart ngrok = New URL**:
   - If ngrok restarts, URL changes
   - Update Slack command URL
   - Or deploy to cloud for permanent URL

3. **Test before sharing**:
   - Test in a private channel first
   - Make sure it works
   - Then share with team

4. **Combine with scheduled reports**:
   - Keep daily scheduled reports (`jira_to_slack.py`)
   - Add on-demand checks (`/handover`)
   - Best of both worlds!

---

Need help? Check the troubleshooting sections in the docs!
