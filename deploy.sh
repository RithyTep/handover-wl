#!/bin/bash
# Railway Deployment Script

echo "======================================================================"
echo "  🚀 Railway Deployment for Jira Handover Dashboard"
echo "======================================================================"
echo ""

# Step 1: Login to Railway
echo "Step 1: Login to Railway..."
echo "This will open your browser for authentication."
echo ""
railway login

if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please try again."
    exit 1
fi

echo ""
echo "✅ Login successful!"
echo ""

# Step 2: Initialize project
echo "Step 2: Initializing Railway project..."
echo ""
railway init

if [ $? -ne 0 ]; then
    echo "❌ Project initialization failed."
    exit 1
fi

echo ""
echo "✅ Project initialized!"
echo ""

# Step 3: Show instructions for environment variables
echo "======================================================================"
echo "  ⚙️  IMPORTANT: Set Environment Variables"
echo "======================================================================"
echo ""
echo "Before deploying, you need to set your environment variables."
echo "You have 2 options:"
echo ""
echo "Option 1 - Via CLI (Run these commands):"
echo "  railway variables set JIRA_URL='https://olympian.atlassian.net'"
echo "  railway variables set JIRA_EMAIL='rithy.tep@techbodia.com'"
echo "  railway variables set JIRA_API_TOKEN='your_token_here'"
echo "  railway variables set SLACK_WEBHOOK_URL='your_webhook_here'"
echo ""
echo "Option 2 - Via Dashboard (Easier):"
echo "  1. Go to: https://railway.app/dashboard"
echo "  2. Select your project"
echo "  3. Click 'Variables' tab"
echo "  4. Add the 4 variables above"
echo ""
read -p "Press Enter after you've set the environment variables..."
echo ""

# Step 4: Deploy
echo "======================================================================"
echo "  🚀 Deploying to Railway..."
echo "======================================================================"
echo ""
railway up

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed."
    exit 1
fi

echo ""
echo "======================================================================"
echo "  ✅ Deployment Successful!"
echo "======================================================================"
echo ""
echo "To get your public URL, run:"
echo "  railway domain"
echo ""
echo "Or visit the Railway dashboard:"
echo "  https://railway.app/dashboard"
echo ""
echo "======================================================================"
