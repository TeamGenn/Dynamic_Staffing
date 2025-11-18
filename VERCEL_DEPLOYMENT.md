# Vercel Deployment Guide

## ✅ Current Setup Status

Your frontend is **ready for Vercel deployment**! The current configuration will work with minimal setup.

## 🚀 Quick Deploy Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository (`TeamGenn/Dynamic_Staffing`)
4. Vercel will auto-detect it's a Next.js project ✅

### 2. Configure Project Settings

**Root Directory:** Set to `frontend` (important!)

- In Vercel project settings, set:
  - **Root Directory:** `frontend`
  - **Framework Preset:** Next.js (auto-detected)
  - **Build Command:** `npm run build` (default)
  - **Output Directory:** `.next` (default)

### 3. Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

**Important:** 
- Replace `https://your-backend-url.railway.app` with your actual Railway backend URL
- The variable name **must** start with `NEXT_PUBLIC_` to be accessible in the browser
- Add this for **Production**, **Preview**, and **Development** environments

### 4. Deploy!

Click **"Deploy"** and Vercel will:
- Install dependencies (`npm install`)
- Build your Next.js app (`npm run build`)
- Deploy to production

## ⚙️ Configuration Details

### What Vercel Auto-Detects:

✅ **Framework:** Next.js 16  
✅ **Build Command:** `npm run build`  
✅ **Output Directory:** `.next`  
✅ **Install Command:** `npm install`  

### Your Current Setup:

✅ **package.json** has correct scripts  
✅ **next.config.mjs** is properly configured  
✅ **TypeScript** configuration is correct  
✅ **Environment variables** are set up correctly  

## 🔧 Optional: Vercel Configuration File

If you want more control, you can create `vercel.json` in the `frontend` directory:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Note:** This is optional - Vercel will auto-detect these settings.

## 🌐 Backend CORS Configuration

Make sure your backend (Railway) has CORS configured to allow your Vercel domain:

In your backend `.env` or Railway environment variables:
```
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-git-main-teamgenn.vercel.app
```

**Vercel URLs:**
- Production: `https://your-app.vercel.app`
- Preview: `https://your-app-git-branch-teamgenn.vercel.app`

## 📝 Post-Deployment Checklist

- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set in Vercel
- [ ] Backend CORS includes your Vercel domain
- [ ] Test the deployed app - check browser console for errors
- [ ] Verify API calls are working (check Network tab)
- [ ] Test file uploads
- [ ] Test task creation
- [ ] Test schedule generation

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
- Make sure Root Directory is set to `frontend` in Vercel settings
- Check that all dependencies are in `package.json`

**Error: "TypeScript errors"**
- Check `next.config.mjs` - `ignoreBuildErrors` is set to `false`
- Fix any TypeScript errors locally first

### API Calls Fail

**Error: "Failed to fetch"**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check backend CORS configuration includes Vercel domain
- Verify backend is running and accessible

**Error: "CORS policy blocked"**
- Add your Vercel URL to backend `CORS_ORIGINS` environment variable
- Format: `https://your-app.vercel.app,https://your-app-git-main-teamgenn.vercel.app`

### Environment Variables Not Working

- Variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after adding/changing environment variables
- Check Vercel logs for any variable-related errors

## 🎯 Recommended Settings

### Build & Development Settings:
- **Node.js Version:** 18.x or 20.x (Vercel auto-selects)
- **Install Command:** `npm install` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### Environment Variables:
- Set for all environments (Production, Preview, Development)
- Use your Railway backend URL for `NEXT_PUBLIC_API_URL`

## 📚 Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Your setup is ready! Just connect the repo and set the environment variable.** 🚀

