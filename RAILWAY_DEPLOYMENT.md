# Deploying to Railway

This guide will help you deploy your Jira Handover Dashboard to Railway.

## Why Railway?

Railway is better suited for this application than Vercel because:
- ✅ **Persistent Storage**: Supports volumes for file storage
- ✅ **Always-on Server**: Not serverless, so your data persists
- ✅ **Easier Environment Variables**: Simple dashboard configuration
- ✅ **Free Tier**: $5 free credits per month

## Prerequisites

1. A [Railway account](https://railway.app) (sign up with GitHub)
2. Your code pushed to GitHub
3. Jira API credentials
4. Slack Webhook URL

## Deployment Methods

### Method 1: Deploy via Railway Dashboard (Recommended)

This is the easiest method and requires no CLI installation.

#### Step 1: Push Your Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

#### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `jira-slack-integration` repository
5. Railway will automatically detect your configuration

#### Step 3: Configure Environment Variables

After the initial deployment, add your environment variables:

1. Click on your service
2. Go to the "Variables" tab
3. Add the following variables:

```env
JIRA_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token_here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PORT=3000
NODE_ENV=production
```

4. Click "Deploy" to redeploy with the new variables

#### Step 4: Set Up Persistent Storage (Important!)

To keep your [ticket_data.json](ticket_data.json) persistent:

1. In your service, click "Settings"
2. Scroll to "Volumes"
3. Click "Add Volume"
4. Configure:
   - **Mount Path**: `/app/ticket_data`
   - **Size**: 1GB (minimum)
5. Click "Add Volume"

6. Update the file path in your code to use the volume:
   - The files will now be stored in `/app/ticket_data/ticket_data.json`
   - You may need to update [nextjs/app/api/save/route.ts](nextjs/app/api/save/route.ts) and [nextjs/app/api/tickets/route.ts](nextjs/app/api/tickets/route.ts)

#### Step 5: Generate Domain

1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Your app will be available at: `https://your-app-name.railway.app`

### Method 2: Deploy via Railway CLI

#### Step 1: Install Railway CLI

```bash
# macOS/Linux
brew install railway

# Or via npm
npm install -g @railway/cli
```

#### Step 2: Login

```bash
railway login
```

This will open your browser to authenticate.

#### Step 3: Initialize and Deploy

```bash
# From your project root
cd "/Users/rithytep/SIDE PROJECT/jira-slack-integration"

# Link to Railway
railway link

# Add environment variables
railway variables set JIRA_URL="https://olympian.atlassian.net"
railway variables set JIRA_EMAIL="rithy.tep@techbodia.com"
railway variables set JIRA_API_TOKEN="ATATT3xFfGF0Fo3dUT4cT3ZOot1KKI3zAXPF-k-cC9K1_NsDQiW94rbR9LiXLLTxDabajTRrq6FevSphf8ckzt1fVAzr58fQNTTm4xMipaRE2deFjwpm80J5kwJeXo6tOHXcaknmha5Qusq4i9GJwggD2r7cai2G_cCBNJwtsM2U9IxO_TdwwT0=2C78D821"
railway variables set SLACK_WEBHOOK_URL="https://hooks.slack.com/services/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"
railway variables set PORT="3000"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

#### Step 4: Add Volume

```bash
# Create a volume
railway volume create --name ticket-data --mount-path /app/ticket_data

# Or do it via the dashboard (easier)
```

## Configuration Files

I've created the following configuration files for you:

### [railway.json](railway.json)
Configures build and deploy commands for Railway.

### [nixpacks.toml](nixpacks.toml)
Tells Railway how to build your Next.js app from the subdirectory.

## Important: File Storage Path

### Current Setup (File-based)

The app currently uses file-based storage at `../ticket_data.json`. This works but:
- ⚠️ Data will be lost if the container restarts (without a volume)
- ✅ Use a Railway Volume to persist the data

### Option 1: Use Railway Volume (Recommended)

1. Add a volume as described above
2. Update the storage path in your API routes:

```typescript
// In nextjs/app/api/save/route.ts and nextjs/app/api/tickets/route.ts
const STORAGE_FILE = path.join('/app/ticket_data', 'ticket_data.json');
```

### Option 2: Use a Database (Best for Production)

For production use, consider using a database:

**Add PostgreSQL:**
```bash
railway add postgresql
```

Then update your code to use PostgreSQL instead of file storage.

## Monitoring and Logs

### View Logs

**Via Dashboard:**
1. Click on your service
2. Go to "Deployments"
3. Click on the latest deployment
4. View real-time logs

**Via CLI:**
```bash
railway logs
```

### Check Build Status

In the Railway dashboard, you can see:
- Build progress
- Deployment status
- Resource usage
- Logs

## Custom Domain (Optional)

To use your own domain:

1. Go to "Settings" → "Networking"
2. Click "Custom Domain"
3. Add your domain (e.g., `jira.yourcompany.com`)
4. Configure DNS records as shown:
   - Add a CNAME record pointing to your Railway domain

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Check that [nixpacks.toml](nixpacks.toml) has correct paths
- Ensure all dependencies are in [nextjs/package.json](nextjs/package.json)

**Error: Port already in use**
- Make sure `PORT` environment variable is set to `3000`
- Railway automatically assigns a port, but Next.js defaults to 3000

### Environment Variables Not Working

- Verify all variables are set in Railway dashboard
- Redeploy after adding variables
- Check logs for any errors

### Data Not Persisting

- Make sure you've added a Railway Volume
- Verify the mount path matches your code
- Check file permissions

### App Crashes on Startup

Check logs:
```bash
railway logs
```

Common issues:
- Missing environment variables
- Build command failed
- Port configuration incorrect

## Costs and Limits

### Free Tier
- $5 free credits per month
- Up to 512MB RAM
- 1GB storage
- 100GB network bandwidth

### Paid Plans
- **Hobby**: $5/month for more resources
- **Pro**: $20/month for teams
- **Enterprise**: Custom pricing

### Typical Usage for This App
- **RAM**: ~100-200MB
- **Storage**: <100MB (without volumes)
- **Network**: Depends on traffic
- **Cost**: Should fit in free tier for light usage

## Next Steps

After deployment:

1. **Test the Application**
   - Visit your Railway URL
   - Check if Jira tickets load
   - Test saving functionality
   - Try sending to Slack

2. **Set Up Monitoring**
   - Use Railway's built-in monitoring
   - Set up alerts for crashes
   - Monitor resource usage

3. **Configure Backups**
   - If using volumes, Railway backs up automatically
   - Consider exporting data periodically

4. **Optimize Performance**
   - Enable HTTP/2
   - Use Railway's CDN for static assets
   - Consider adding Redis for caching

## Support and Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)
- [Next.js on Railway](https://railway.app/starters/nextjs)

## Comparison: Railway vs Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| Persistent Storage | ✅ Volumes | ❌ Serverless only |
| Always-on Server | ✅ Yes | ❌ Serverless |
| Free Tier | $5 credits/month | Generous free tier |
| Database Support | ✅ Native | External only |
| Deployment Speed | Medium | Fast |
| Best For | Full-stack apps | Static/JAMstack |

**For this app**: Railway is better because you need persistent file storage for `ticket_data.json`.
