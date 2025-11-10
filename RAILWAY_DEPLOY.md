# 🚀 Railway Deployment - Quick Guide

## ✅ **You're All Set!**

Everything is configured and ready to deploy:
- ✅ Code updated for Railway
- ✅ `Procfile` created
- ✅ `runtime.txt` created
- ✅ `requirements.txt` ready
- ✅ Railway CLI installed (v4.11.0)

---

## 🎯 **Deploy in 3 Steps**

### **Option 1: Use Automated Script (Easiest)**

```bash
cd /Users/rithytep/jira-slack-integration
./deploy.sh
```

The script will guide you through:
1. Login to Railway
2. Initialize project
3. Set environment variables
4. Deploy

### **Option 2: Manual Commands**

```bash
cd /Users/rithytep/jira-slack-integration

# Step 1: Login
railway login

# Step 2: Create project
railway init

# Step 3: Set environment variables
railway variables set JIRA_URL="https://olympian.atlassian.net"
railway variables set JIRA_EMAIL="rithy.tep@techbodia.com"
railway variables set JIRA_API_TOKEN="ATATT3xFfGF0..."
railway variables set SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Step 4: Deploy
railway up

# Step 5: Get your public URL
railway domain
```

---

## 🌐 **After Deployment**

### **Get Your Public URL**
```bash
railway domain
```

You'll get a URL like: `https://jira-handover-production.up.railway.app`

### **Add Custom Domain (Optional)**
1. Go to Railway dashboard: https://railway.app/dashboard
2. Select your project
3. Go to Settings → Domains
4. Click "Generate Domain" or add custom domain

---

## 🔧 **Useful Commands**

```bash
# Check deployment status
railway status

# View logs
railway logs

# Open in browser
railway open

# Redeploy
railway up

# Link to existing project
railway link

# Environment variables
railway variables          # List all
railway variables set KEY=value    # Add/update
railway variables delete KEY       # Remove
```

---

## 📊 **Monitor Your App**

### **View Logs in Real-Time**
```bash
railway logs --follow
```

### **Check Resource Usage**
Go to: https://railway.app/dashboard → Your Project → Metrics

---

## 🐛 **Troubleshooting**

### **Issue: "No project found"**
```bash
railway link
# Select your project from the list
```

### **Issue: "Port already in use"**
Railway automatically assigns PORT - your code is already configured ✅

### **Issue: "Module not found"**
```bash
# Check requirements.txt has all dependencies
cat requirements.txt

# Add missing package
echo "package-name==version" >> requirements.txt
railway up
```

### **Issue: "Environment variables not set"**
```bash
# Check variables
railway variables

# Set missing ones
railway variables set KEY="value"
```

---

## 💾 **Your Data**

✅ **Persistent Storage**: Your `ticket_data.json` is saved on Railway's persistent disk.

**Location**: `/app/ticket_data.json` on Railway server

**Backup** (optional):
```bash
# Download current data
railway run cat ticket_data.json > backup.json
```

---

## 🔄 **Update/Redeploy**

After making code changes:

```bash
cd /Users/rithytep/jira-slack-integration

# Option 1: Quick redeploy
railway up

# Option 2: With logs
railway up && railway logs --follow
```

---

## 💰 **Pricing**

**Free Tier**:
- 500 execution hours/month
- $5 free credit/month
- Perfect for your use case!

**If you need more**: $5/month for hobby plan

---

## ✨ **That's It!**

Your dashboard will be live at: `https://your-app.up.railway.app`

**Features**:
- ✅ HTTPS automatically enabled
- ✅ Persistent file storage
- ✅ Auto-restart on crashes
- ✅ Environment variables secured
- ✅ Easy rollback to previous deploys

---

## 🚀 **Quick Start**

Just run:
```bash
cd /Users/rithytep/jira-slack-integration
./deploy.sh
```

Or:
```bash
railway login
railway init
railway up
```

**Done!** 🎉
