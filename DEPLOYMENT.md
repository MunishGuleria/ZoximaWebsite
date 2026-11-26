# Vercel Deployment Guide for Persimium Website

## Prerequisites
- Git installed on your computer
- GitHub account
- Vercel account (free tier is fine)

## Step 1: Prepare Your Repository

### Option A: If you already have a Git repository
```bash
# Make sure all files are committed
git add .
git commit -m "Added SEO optimizations and contact email"
git push origin main
```

### Option B: If you need to create a new Git repository
```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit with SEO optimizations"

# Create a new repository on GitHub (do this in your browser first)
# Then link your local repository to GitHub:
git remote add origin https://github.com/YOUR_USERNAME/persimum-website.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in or create a free account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - If not connected, click "Connect to GitHub" and authorize Vercel

3. **Select Repository**
   - Find and select your `persimum-website` repository
   - Click "Import"

4. **Configure Project**
   - **Project Name:** persimum-website (or your preferred name)
   - **Framework Preset:** Next.js (should be auto-detected)
   - **Root Directory:** ./ (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** .next (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

5. **Environment Variables** (if needed)
   - Add any environment variables here if you have them
   - For now, you can skip this section

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at: `https://persimum-website.vercel.app` (or similar)

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project's name? persimum-website
# - In which directory is your code located? ./
# - Auto-detect settings? Yes
# - Override settings? No

# For production deployment
vercel --prod
```

## Step 3: Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain: `persimum.com`
4. Follow Vercel's instructions to update your DNS settings:
   - Add an A record pointing to Vercel's IP
   - Or add a CNAME record pointing to `cname.vercel-dns.com`

### Example DNS Settings
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Step 4: Verify Deployment

After deployment, check these:

1. **Homepage:** https://your-site.vercel.app/
2. **Services:** https://your-site.vercel.app/services
3. **Pricing:** https://your-site.vercel.app/pricing
4. **About:** https://your-site.vercel.app/about
5. **Demo:** https://your-site.vercel.app/demo
6. **Testimonials:** https://your-site.vercel.app/testimonials

### Verify SEO Files
- **Robots.txt:** https://your-site.vercel.app/robots.txt
- **Sitemap:** https://your-site.vercel.app/sitemap.xml

## Step 5: Post-Deployment Tasks

### 1. Update Google Search Console
- Go to https://search.google.com/search-console
- Add your Vercel domain
- Submit your sitemap: `https://your-site.vercel.app/sitemap.xml`

### 2. Update Meta Tags
- Open `app/layout.tsx`
- Replace `https://persimum.com` with your actual Vercel URL or custom domain
- Line 14: Update metadataBase URL
- Commit and push changes

### 3. Test Social Sharing
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Paste your URL and verify the preview looks correct

### 4. Monitor Analytics
- Vercel Analytics is already installed
- View analytics in Vercel Dashboard → Analytics

## Troubleshooting

### Build Fails
```bash
# Check build locally first
npm run build

# If it works locally but fails on Vercel:
# - Check Node.js version in package.json
# - Ensure all dependencies are in package.json (not just devDependencies)
```

### Environment Variables Issue
- Make sure all required environment variables are set in Vercel Dashboard
- Settings → Environment Variables

### Domain Not Working
- DNS changes can take up to 48 hours
- Use Vercel's default domain while waiting
- Check DNS propagation: https://www.whatsmydns.net/

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **Push to main branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

## Updating Your Site

```bash
# Make changes to your files
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub (triggers automatic deployment)
git push origin main

# Deployment will happen automatically
# Check deployment status in Vercel Dashboard
```

## Support

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Next.js Documentation:** https://nextjs.org/docs

## Quick Commands Reference

```bash
# Local development
npm run dev              # Start dev server at http://localhost:3000

# Production build
npm run build           # Build for production
npm start               # Start production server

# Deployment
vercel                  # Deploy to preview
vercel --prod          # Deploy to production

# Git
git status             # Check status
git add .              # Stage all changes
git commit -m "msg"    # Commit changes
git push               # Push to GitHub
```

---

## Your Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Connected GitHub to Vercel
- [ ] Deployed to Vercel
- [ ] Verified all pages work
- [ ] Checked robots.txt and sitemap.xml
- [ ] (Optional) Added custom domain
- [ ] (Optional) Submitted sitemap to Google Search Console
- [ ] Updated metadataBase URL in layout.tsx with actual domain
- [ ] Tested social media previews
- [ ] Verified contact form works
- [ ] Tested Calendly widget on demo page

Your site is now live! 🎉

Contact: info@persimium.com
