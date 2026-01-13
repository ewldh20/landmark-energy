# Setting Up GitHub Pages with GoDaddy Domain

## Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/ewldh20/landmark-energy
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Save/leave it - the workflow will automatically deploy

## Step 2: Wait for First Deployment

1. Go to the **Actions** tab in your repo
2. You should see a workflow running (or completed)
3. Wait for it to finish (green checkmark)
4. Your site will be live at: `https://ewldh20.github.io/landmark-energy`

## Step 3: Add Custom Domain in GitHub

1. Still in **Settings** → **Pages**
2. Under **Custom domain**, enter your domain:
   - Example: `landmarkenergy.co.uk` (without www)
   - Or: `www.landmarkenergy.co.uk` (with www)
3. Click **Save**
4. GitHub will create a file called `CNAME` in your repo

## Step 4: Configure DNS in GoDaddy

1. Log into your **GoDaddy account**
2. Go to **My Products** → **Domains**
3. Click **DNS** next to your domain
4. You'll see current DNS records

### Option A: Using CNAME (Recommended - Easier)

**For www subdomain:**
- Click **Add** to create a new record
- Type: `CNAME`
- Name: `www`
- Value: `ewldh20.github.io`
- TTL: 600 (or default)
- Click **Save**

**For root domain (landmarkenergy.co.uk):**
- GitHub Pages doesn't support CNAME for root domains
- You need to use A records (see Option B)

### Option B: Using A Records (For root domain)

**If you want `landmarkenergy.co.uk` (without www):**

1. In GoDaddy DNS, add **4 A records**:
   - Type: `A`
   - Name: `@` (or leave blank for root)
   - Value: `185.199.108.153`
   - TTL: 600
   
   - Type: `A`
   - Name: `@`
   - Value: `185.199.109.153`
   - TTL: 600
   
   - Type: `A`
   - Name: `@`
   - Value: `185.199.110.153`
   - TTL: 600
   
   - Type: `A`
   - Name: `@`
   - Value: `185.199.111.153`
   - TTL: 600

2. **Also add a CNAME for www:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `ewldh20.github.io`
   - TTL: 600

**Note:** These IP addresses are GitHub Pages IPs. They may change - check GitHub's documentation for current IPs.

## Step 5: Wait for DNS Propagation

- DNS changes can take **15 minutes to 48 hours** to propagate
- Usually works within 1-2 hours
- You can check status at: https://www.whatsmydns.net

## Step 6: Verify SSL Certificate

1. After DNS propagates, GitHub will automatically create an SSL certificate
2. This can take a few minutes to a few hours
3. Check in **Settings** → **Pages** → you should see "Certificate is ready"

## Step 7: Test Your Site

Once DNS propagates and SSL is ready:
- Visit: `https://landmarkenergy.co.uk` (or your domain)
- It should show your site!

## Troubleshooting

**Site not loading?**
- Wait longer for DNS (can take up to 48 hours)
- Check DNS propagation: https://www.whatsmydns.net
- Make sure DNS records are correct in GoDaddy

**SSL certificate not ready?**
- Wait a bit longer (GitHub needs to verify DNS first)
- Make sure DNS is pointing correctly

**Want both www and non-www?**
- Set up both CNAME (www) and A records (@)
- Or use GoDaddy's domain forwarding

## Important Notes

- **Don't delete** the `CNAME` file GitHub creates in your repo
- If you change the domain in GitHub, update DNS accordingly
- The site will be available at both:
  - `https://landmarkenergy.co.uk`
  - `https://ewldh20.github.io/landmark-energy` (still works)
