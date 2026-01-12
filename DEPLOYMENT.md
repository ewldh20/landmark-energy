# Deployment Guide

## Overview

This site has two parts:
- **Frontend**: React app (can be hosted on GitHub Pages, Vercel, Netlify)
- **Backend**: Node.js API server (needs separate hosting)

## Option 1: GitHub Pages (Frontend) + Railway/Render (Backend)

### Frontend on GitHub Pages

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Push to GitHub and enable Pages:**
   - Go to your repo Settings → Pages
   - Source: GitHub Actions
   - The workflow in `.github/workflows/deploy.yml` will auto-deploy

3. **Link your GoDaddy domain:**
   - In GitHub Pages settings, add your custom domain
   - In GoDaddy DNS settings, add:
     - Type: `CNAME`
     - Name: `@` or `www`
     - Value: `yourusername.github.io` (or your Pages domain)

### Backend on Railway (Recommended - Easy & Free tier)

1. **Sign up at [railway.app](https://railway.app)**
2. **Create new project → Deploy from GitHub**
3. **Select your repo and set:**
   - Root Directory: `/server`
   - Build Command: (leave empty - tsx runs directly)
   - Start Command: `tsx index.ts`
4. **Add environment variables:**
   - `PORT` (Railway will auto-assign, but you can set it)
   - `CONTACT_EMAIL=elliot@landmarkenergy.co.uk`
   - Email config (Gmail or SMTP)
5. **Get your backend URL** (e.g., `https://your-app.railway.app`)
6. **Update frontend:**
   - Create `.env.production` file:
     ```
     VITE_API_URL=https://your-app.railway.app/api
     ```
   - Rebuild and redeploy

### Backend on Render (Alternative)

1. **Sign up at [render.com](https://render.com)**
2. **Create new Web Service**
3. **Connect GitHub repo**
4. **Settings:**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && tsx index.ts`
   - Environment: Add your env variables
5. **Get backend URL and update frontend as above**

## Option 2: Full-Stack on Vercel (Easiest)

Vercel can host both frontend and backend:

1. **Sign up at [vercel.com](https://vercel.com)**
2. **Import your GitHub repo**
3. **Vercel will auto-detect:**
   - Frontend: Builds from root
   - Backend: Needs to be in `/api` folder or configured
4. **For backend, create `/api` folder** and move server code there, or:
   - Use Vercel Serverless Functions
   - Convert Express routes to serverless functions
5. **Add environment variables in Vercel dashboard**
6. **Link domain:**
   - In Vercel project settings → Domains
   - Add your GoDaddy domain
   - Update GoDaddy DNS:
     - Type: `A` records pointing to Vercel IPs
     - Or use Vercel's nameservers

## Option 3: Full-Stack on Netlify

Similar to Vercel:

1. **Sign up at [netlify.com](https://netlify.com)**
2. **Deploy from GitHub**
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **For backend:** Use Netlify Functions (convert Express to serverless)
5. **Add environment variables**
6. **Link domain in Netlify settings**

## Custom Domain Setup (GoDaddy)

### For GitHub Pages:
1. In GitHub repo → Settings → Pages → Custom domain
2. Enter your domain (e.g., `landmarkenergy.co.uk`)
3. In GoDaddy DNS:
   - Add CNAME: `www` → `yourusername.github.io`
   - Or A records: Point to GitHub Pages IPs (see GitHub docs)

### For Vercel/Netlify:
1. Add domain in their dashboard
2. They'll provide DNS records
3. Update GoDaddy DNS with those records

## Email Configuration

For production, you'll need to configure email in your backend's environment variables:

**Option A: Gmail (for testing)**
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

**Option B: SMTP (recommended for production)**
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
EMAIL_FROM="Landmark Energy <noreply@landmarkenergy.co.uk>"
```

**Option C: Email Service (best for production)**
- SendGrid (free tier: 100 emails/day)
- Mailgun (free tier: 5,000 emails/month)
- AWS SES (very cheap)

## Quick Start: Railway Backend

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. In your project: `railway init`
4. Deploy: `railway up` (from server directory)
5. Set env vars: `railway variables`
6. Get URL: `railway domain`

## Notes

- GitHub Pages is **free** but **static only** (no backend)
- Railway/Render have **free tiers** for backend
- Vercel/Netlify have **free tiers** for full-stack
- Custom domains work with all of these
- Email will work once backend is deployed and configured
