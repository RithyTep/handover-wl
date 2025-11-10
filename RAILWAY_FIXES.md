# Railway Deployment Fixes

## Issues Found and Fixed

### 1. Port Configuration ✅ FIXED
**Problem**: The app was hardcoded to port 3000, but Railway assigns a dynamic port.

**Solution**: Updated [nextjs/package.json](nextjs/package.json) line 8:
```json
"start": "next start -p ${PORT:-3000}"
```

This now uses Railway's `PORT` environment variable.

### 2. File Storage Path ⚠️ NEEDS ATTENTION
**Problem**: The storage file path uses `../ticket_data.json` which may not work on Railway.

**Current code** in API routes:
```typescript
const STORAGE_FILE = path.join(process.cwd(), "../ticket_data.json");
```

**Two Options to Fix**:

#### Option A: Use Railway Volume (Recommended)
1. In Railway dashboard, add a Volume:
   - Mount path: `/data`
   - Size: 1GB

2. Update the file paths in these files:
   - [nextjs/app/api/save/route.ts](nextjs/app/api/save/route.ts) line 5
   - [nextjs/app/api/tickets/route.ts](nextjs/app/api/tickets/route.ts) line 18

Change to:
```typescript
const STORAGE_FILE = process.env.STORAGE_PATH || path.join(process.cwd(), "ticket_data.json");
```

3. Add environment variable in Railway:
```
STORAGE_PATH=/data/ticket_data.json
```

#### Option B: Use Same Directory (Quick Fix)
Change the storage path to be in the same directory:

```typescript
const STORAGE_FILE = path.join(process.cwd(), "ticket_data.json");
```

**Note**: Without a volume, data will be lost on redeploy!

### 3. Environment Variables Required

Make sure these are set in Railway dashboard:

```env
JIRA_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
PORT=3000
NODE_ENV=production
```

Railway will automatically set `PORT`, but you can leave it as 3000 for clarity.

## Quick Deploy Steps

1. **Commit the fixes**:
```bash
git add .
git commit -m "Fix Railway deployment issues"
git push origin main
```

2. **In Railway Dashboard**:
   - Go to your service → "Variables"
   - Add all environment variables listed above
   - Go to "Settings" → Click "Deploy"

3. **Check the logs**:
   - Go to "Deployments" → Click latest deployment
   - Watch the build and deploy logs
   - Look for any errors

4. **Test the deployment**:
   - Once deployed, click the generated URL
   - Check if the app loads
   - Test loading Jira tickets

## Common Errors and Solutions

### "Application failed to respond"
**Causes**:
- Missing environment variables
- Wrong PORT configuration
- Build failed
- App crashed on startup

**Debug**:
```bash
# Via CLI
railway logs

# Or check in dashboard: Deployments → Latest → Logs
```

### "Cannot find module"
**Cause**: Missing dependencies

**Fix**: Make sure all deps are in [nextjs/package.json](nextjs/package.json) `dependencies` (not `devDependencies`)

### "ENOENT: no such file or directory"
**Cause**: File path issue with `ticket_data.json`

**Fix**: Either:
1. Add a Railway Volume and update paths (see Option A above)
2. Use same directory path (see Option B above)

### Build succeeds but app doesn't start
**Check**:
1. Logs for startup errors
2. Environment variables are set
3. PORT is not hardcoded

## Testing Locally Before Deploy

Test the production build locally:

```bash
cd nextjs

# Build
npm run build

# Set env vars
export JIRA_URL="https://yourcompany.atlassian.net"
export JIRA_EMAIL="your-email@company.com"
export JIRA_API_TOKEN="your_token"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."
export PORT=3000

# Start production server
npm start
```

Visit http://localhost:3000 and test all functionality.

## Next Steps After Successful Deployment

1. **Add Volume for Persistence**:
   - Settings → Volumes → Add Volume
   - Mount path: `/data`
   - Update code to use `/data/ticket_data.json`

2. **Set up Custom Domain** (optional):
   - Settings → Networking → Custom Domain
   - Add your domain
   - Configure DNS

3. **Monitor**:
   - Check logs regularly
   - Monitor resource usage
   - Set up alerts for crashes

## Files Modified

- ✅ [nextjs/package.json](nextjs/package.json) - Fixed PORT issue
- ✅ [Procfile](Procfile) - Added start command
- ✅ [railway.json](railway.json) - Railway config
- ✅ [nixpacks.toml](nixpacks.toml) - Build config
- ⚠️  API routes need volume path update (optional)

## Support

If you're still having issues:
1. Check Railway logs carefully
2. Verify all environment variables
3. Try the "Quick Fix" Option B for file storage
4. Refer to [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for full guide
