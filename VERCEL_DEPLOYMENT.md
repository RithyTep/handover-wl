# 🚀 Vercel Deployment Guide

## ⚠️ Important Limitations

Vercel's serverless functions have **read-only filesystems** except for `/tmp`, which is **cleared between invocations**. This means:

- ❌ **File storage won't persist** between requests
- ❌ `ticket_data.json` will be lost after each function execution
- ✅ The app will work, but won't save ticket status/actions permanently

## 🎯 **Recommended Solutions**

### **Option 1: Deploy on Railway/Render (Recommended)**
For persistent file storage, use platforms that support persistent filesystems:

- **Railway.app** - Free tier, easy deployment
- **Render.com** - Free tier, Python support
- **Fly.io** - Free tier, global edge
- **Heroku** - Paid, but reliable

### **Option 2: Use Vercel with Database**
Modify the app to use a database instead of JSON file:
- **Vercel Postgres** (KV Store)
- **Supabase** (Free PostgreSQL)
- **MongoDB Atlas** (Free tier)
- **PlanetScale** (Free MySQL)

### **Option 3: Deploy Locally with ngrok**
Keep running locally and expose via ngrok:
```bash
# Terminal 1: Run the app
handover

# Terminal 2: Expose publicly
ngrok http 5555
```

## 📦 **How to Deploy on Railway** (Easiest)

### **1. Install Railway CLI**
```bash
npm install -g @railway/cli
# or
brew install railway
```

### **2. Login & Deploy**
```bash
cd /Users/rithytep/jira-slack-integration

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set JIRA_URL="https://olympian.atlassian.net"
railway variables set JIRA_EMAIL="rithy.tep@techbodia.com"
railway variables set JIRA_API_TOKEN="your_token_here"
railway variables set SLACK_WEBHOOK_URL="your_webhook_here"

# Deploy
railway up
```

### **3. Get Public URL**
```bash
railway domain
# Or add custom domain in Railway dashboard
```

### **4. Update `handover_gui.py` for Railway**
Change line 1130:
```python
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5555))
    app.run(host='0.0.0.0', port=port, debug=False)
```

That's it! Railway will automatically detect Flask and deploy.

## 📦 **How to Deploy on Render** (Free)

### **1. Create `render.yaml`**
```yaml
services:
  - type: web
    name: jira-handover
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python handover_gui.py
    envVars:
      - key: JIRA_URL
        sync: false
      - key: JIRA_EMAIL
        sync: false
      - key: JIRA_API_TOKEN
        sync: false
      - key: SLACK_WEBHOOK_URL
        sync: false
```

### **2. Push to GitHub**
```bash
cd /Users/rithytep/jira-slack-integration
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/jira-handover.git
git push -u origin main
```

### **3. Connect to Render**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Render auto-detects Python
5. Add environment variables
6. Click "Create Web Service"

Done! You'll get a public URL like `https://jira-handover.onrender.com`

## 🔒 **Security Tips**

### **1. Add Basic Auth (Optional)**
Protect your dashboard with password:

```python
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

auth = HTTPBasicAuth()

users = {
    "admin": generate_password_hash("your_password")
}

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

@app.route('/')
@auth.login_required
def index():
    # ... existing code
```

### **2. Add IP Whitelist (Optional)**
```python
ALLOWED_IPS = os.getenv('ALLOWED_IPS', '').split(',')

@app.before_request
def limit_remote_addr():
    if ALLOWED_IPS and request.remote_addr not in ALLOWED_IPS:
        abort(403)
```

## 🌐 **Vercel Deployment (If you still want to try)**

**Note:** This will work but won't save ticket data between sessions.

### **1. Modify for Serverless**
Create `api/index.py` and copy all content from `handover_gui.py` but:
- Remove lines 1116-1130 (the `if __name__ == '__main__'` block)
- Change line 26 to: `STORAGE_FILE = '/tmp/ticket_data.json'`
- Remove webbrowser/threading imports (lines 13-14)

### **2. Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/rithytep/jira-slack-integration
vercel

# Add environment variables in Vercel dashboard
```

### **3. Set Environment Variables**
Go to Vercel Dashboard → Project → Settings → Environment Variables:
- `JIRA_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `SLACK_WEBHOOK_URL`

## ✅ **Recommended: Railway**

For your use case, **Railway** is the best choice:
- ✅ Persistent file storage
- ✅ Free tier (500 hours/month)
- ✅ Easy deployment
- ✅ Automatic HTTPS
- ✅ No code changes needed

**Deploy command:**
```bash
railway login
railway init
railway up
```

That's it! 🎉
