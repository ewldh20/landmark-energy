# How to Push to GitHub

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Repository name: `landmark-energy` (or whatever you prefer)
4. Description: "Landmark Energy - UK biofuel crop aggregation platform"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

## Step 2: Push Your Code

Run these commands in your terminal (from your project directory):

```bash
# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - Landmark Energy website"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/landmark-energy.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push

## Step 4: Add Custom Domain (Optional)

1. In **Settings** → **Pages** → **Custom domain**
2. Enter your domain (e.g., `landmarkenergy.co.uk`)
3. Follow GitHub's instructions to update your GoDaddy DNS

## Troubleshooting

**If you get "remote origin already exists":**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/landmark-energy.git
```

**If you need to authenticate:**
- GitHub now requires a Personal Access Token instead of password
- Create one at: Settings → Developer settings → Personal access tokens → Tokens (classic)
- Use the token as your password when pushing
