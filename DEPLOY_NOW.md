# 🚀 Deploy to Railway - Run These Commands

Open your terminal and run these commands **one by one**:

---

## Step 1: Go to project directory
```bash
cd /Users/rithytep/jira-slack-integration
```

---

## Step 2: Login to Railway
```bash
railway login
```
**This will open your browser** - login with:
- GitHub account, OR
- Email

After login, return to terminal.

---

## Step 3: Initialize Railway project
```bash
railway init
```
You'll be asked:
- **Project name**: Enter anything (e.g., "jira-handover")
- **Environment**: Choose "production"

---

## Step 4: Set environment variables

Copy and paste these commands **one by one** (replace with your actual values):

```bash
railway variables set JIRA_URL="https://olympian.atlassian.net"
```

```bash
railway variables set JIRA_EMAIL="rithy.tep@techbodia.com"
```

```bash
railway variables set JIRA_API_TOKEN="ATATT3xFfGF0_your_actual_token_here"
```

```bash
railway variables set SLACK_WEBHOOK_URL="https://hooks.slack.com/services/your_webhook_url_here"
```

**Get your values from:**
- JIRA_API_TOKEN: Copy from `.env` file
- SLACK_WEBHOOK_URL: Copy from `.env` file

```bash
# Quick way to see your .env file:
cat .env
```

---

## Step 5: Deploy!
```bash
railway up
```

This will:
- Upload your code
- Install dependencies (Flask, requests, python-dotenv)
- Start your app
- Takes ~1-2 minutes

---

## Step 6: Get your public URL
```bash
railway domain
```

This will show your live URL like:
```
https://jira-handover-production.up.railway.app
```

**Or generate a new domain:**
```bash
railway domain
# Select "Generate New Domain"
```

---

## ✅ Done!

Your dashboard is now live at the URL shown above!

**Test it:**
- Open the URL in your browser
- You should see your Jira Handover Dashboard
- All features work (edit, save, post to Slack)
- Data persists permanently

---

## 🔧 Useful Commands

**View logs (in real-time):**
```bash
railway logs --follow
```

**Redeploy after making changes:**
```bash
railway up
```

**Open Railway dashboard:**
```bash
railway open
```

**Check status:**
```bash
railway status
```

---

## 🐛 If Something Goes Wrong

**Check logs:**
```bash
railway logs
```

**Restart the service:**
```bash
railway restart
```

**Redeploy:**
```bash
railway up --force
```

---

## 📝 Quick Reference

Your `.env` file location: `/Users/rithytep/jira-slack-integration/.env`

To copy values quickly:
```bash
cat /Users/rithytep/jira-slack-integration/.env
```

---

**That's it! Start with Step 1 above.** 🚀
