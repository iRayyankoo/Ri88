
# 🚀 How to Deploy Ri88 to Vercel

Since your project uses **Next.js API Routes** (for the Sports feature), we highly recommend deploying to **Vercel**. It is free, fast, and works automatically with GitHub.

## Step 1: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com).
2. Click **"Sign Up"** and choose **"Continue with GitHub"**.
3. Authorize Vercel to access your GitHub account.

## Step 2: Import Your Repository

1. On your Vercel Dashboard, click **"Add New..."** -> **"Project"**.
2. You will see a list of your GitHub repositories. Find **`Rayyan`** and click **"Import"**.
    * *If you don't see it, click "Adjust GitHub App Permissions" and select the `Rayyan` repository.*

## Step 3: Configure & Deploy

1. **Framework Preset:** It should automatically detect **Next.js**.
2. **Root Directory:** It should be `./` (default).
3. **Environment Variables:**
    * You do **NOT** need to add any variables right now (the API key is included in the code for this version).
4. Click **"Deploy"**.

## Step 4: Celebration 🎉

Vercel will take about 1-2 minutes to build your site. Once done, you will get a live URL (like `rayyan.vercel.app`).
Everything, including the **Sports Live Scores**, will work perfectly!

---

### Why not GitHub Pages?

GitHub Pages only supports "Static" sites. Your new site has a special feature (the Sports Proxy) that needs a server to run. GitHub Pages cannot run this server, so the Sports page would break. Vercel handles this automatically.
