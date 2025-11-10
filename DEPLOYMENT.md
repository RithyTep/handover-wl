# Deploying to Vercel

This guide will help you deploy your Jira Handover Dashboard to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is fine)
2. Your repository pushed to GitHub, GitLab, or Bitbucket
3. Jira API credentials
4. Slack Webhook URL

## Important Note About File Storage

**⚠️ Warning:** Vercel's serverless environment has a read-only filesystem. The current implementation uses file-based storage ([ticket_data.json](ticket_data.json)) which will NOT persist data between deployments.

**For production use, you need to integrate a database:**
- Vercel Postgres (recommended)
- MongoDB Atlas
- Supabase
- PlanetScale
- Or any other cloud database

The current file storage will work for **read-only** operations but saved data will be lost on each deployment.

## Deployment Steps

### 1. Push Your Code to Git

Make sure all your latest changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project root:
```bash
vercel
```

4. Follow the prompts:
   - **Set up and deploy?** Yes
   - **Which scope?** Select your account
   - **Link to existing project?** No
   - **Project name?** jira-handover-dashboard (or your preferred name)
   - **Which directory is your code located?** ./
   - **Override settings?** No

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel should auto-detect the Next.js framework
5. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `cd nextjs && npm run build`
   - **Output Directory:** `nextjs/.next`
   - **Install Command:** `cd nextjs && npm install`

### 3. Configure Environment Variables

After deployment (or before), add your environment variables in the Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `JIRA_URL` | `https://yourcompany.atlassian.net` | Your Jira instance URL (no trailing slash) |
| `JIRA_EMAIL` | `your-email@company.com` | Your Jira email address |
| `JIRA_API_TOKEN` | `your_api_token_here` | Get from [Jira API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/...` | Get from [Slack Webhooks](https://api.slack.com/messaging/webhooks) |

4. For each variable, select the environment:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Click "Save"

### 4. Redeploy

After adding environment variables:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

### 5. Access Your App

Your app will be available at:
```
https://your-project-name.vercel.app
```

## Custom Domain (Optional)

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Make sure all dependencies are in [package.json](nextjs/package.json)
- Check that [vercel.json](vercel.json) has the correct paths

**Error: Environment variable not found**
- Verify all environment variables are set in Vercel dashboard
- Redeploy after adding variables

### Data Not Persisting

This is expected - see the warning about file storage above. You need to:
1. Set up a database (Vercel Postgres recommended)
2. Update the API routes to use the database instead of file storage
3. Modify [nextjs/app/api/save/route.ts](nextjs/app/api/save/route.ts) and [nextjs/app/api/tickets/route.ts](nextjs/app/api/tickets/route.ts)

### API Routes Timeout

Vercel has a 10-second timeout for serverless functions on the free tier:
- Optimize Jira API calls
- Consider upgrading to Pro for 60-second timeout
- Use edge functions for faster responses

## Next Steps

For a production-ready deployment:

1. **Add Database Integration**
   ```bash
   # Install Vercel Postgres
   npm install @vercel/postgres
   ```

2. **Set up Authentication**
   - Add NextAuth.js or Auth0
   - Protect your routes

3. **Add Rate Limiting**
   - Prevent API abuse
   - Use Vercel Edge Config

4. **Monitor Performance**
   - Use Vercel Analytics
   - Set up error tracking (Sentry)

5. **Enable Caching**
   - Use SWR for client-side caching
   - Implement ISR (Incremental Static Regeneration)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Support](https://vercel.com/support)
