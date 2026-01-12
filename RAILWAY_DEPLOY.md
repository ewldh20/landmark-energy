# Deploy Backend to Railway (Free)

## Step 1: Sign up for Railway

1. Go to: https://railway.app
2. Sign up with GitHub (easiest)
3. You'll get $5 free credit/month

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `landmark-energy` repository
4. Railway will detect it automatically

## Step 3: Configure the Service

1. In your Railway project, click on the service
2. Go to "Settings"
3. Set:
   - **Root Directory**: Leave empty (or set to `/` if needed)
   - **Start Command**: `cd server && tsx index.ts`
   - Railway will auto-detect Node.js

## Step 4: Add Environment Variables

In Railway dashboard → Variables, add all these from your `.env` file:

```
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_REFRESH_TOKEN=your-refresh-token
OAUTH_USER_EMAIL=elliot@landmarkenergy.co.uk
OAUTH_TENANT_ID=your-tenant-id
EMAIL_FROM="Landmark Energy Website <elliot@landmarkenergy.co.uk>"
CONTACT_EMAIL=elliot@landmarkenergy.co.uk
PORT=4051
```

**Important**: Copy all values from your local `.env` file!

## Step 5: Get Your Backend URL

1. Railway will give you a URL like: `https://your-app.railway.app`
2. Copy this URL - you'll need it for the frontend

## Step 6: Update Frontend to Use Production API

The frontend needs to know where your backend is. We'll use an environment variable.

### Option A: Update GitHub Pages (Recommended)

1. In your GitHub repo, go to Settings → Secrets and variables → Actions
2. Add a new secret:
   - Name: `VITE_API_URL`
   - Value: `https://your-app.railway.app/api` (your Railway URL + `/api`)

3. Update `.github/workflows/deploy.yml` to use this secret (I'll help with this)

### Option B: Hardcode for now (Quick test)

Update `src/components/ContactModal.tsx` temporarily to use your Railway URL.

## Step 7: Deploy

1. Railway will auto-deploy when you push to GitHub
2. Or click "Deploy" in Railway dashboard
3. Wait for it to finish (2-3 minutes)

## Step 8: Test

1. Go to your live site: https://landmarkenergy.co.uk
2. Try the contact form
3. Check Railway logs if there are errors

## Troubleshooting

- **Port issues**: Railway sets `PORT` automatically, your code already handles this
- **Environment variables**: Make sure all are set in Railway dashboard
- **CORS errors**: The backend already has CORS enabled for all origins
- **Email not sending**: Check Railway logs for OAuth errors
