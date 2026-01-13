# 🚂 Railway.app Deployment Guide

Complete step-by-step guide to deploy your Grocery Store API to Railway.app.

## 📋 Prerequisites

- GitHub account with your code pushed
- Railway.app account (sign up at https://railway.app)
- Your project on GitHub: `https://github.com/ArijitSarkar97/Grocery-api-swagger-studio`

---

## 🎯 Part 1: Deploy Backend to Railway

### Step 1: Create New Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select `Grocery-api-swagger-studio` repository

### Step 2: Configure Backend Service

1. Railway will detect it's a Python project
2. Click **"Add variables"** or go to **Variables** tab

### Step 3: Set Environment Variables

Add these variables in Railway:

```env
DATABASE_URL=postgresql://postgres:password@postgres.railway.internal:5432/railway
SECRET_KEY=<generate-random-32-char-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.railway.app
```

**Generate SECRET_KEY:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# Copy the output
```

**Important:** Update `CORS_ORIGINS` after deploying frontend (Step 2 below)

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates `DATABASE_URL` variable
4. Your backend will use this PostgreSQL database

### Step 5: Configure Build Settings

Railway should auto-detect settings, but verify:

**Root Directory:** `backend`

**Build Command:** (Auto-detected from `Procfile`)
```bash
pip install -r requirements.txt
```

**Start Command:** (From `backend/Procfile`)
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 6: Deploy Backend

1. Click **"Deploy"** or wait for automatic deployment
2. Railway will:
   - Install dependencies
   - Start the server
   - Provide a public URL

### Step 7: Get Backend URL

1. Go to **"Settings"** tab
2. Click **"Generate Domain"** under **Public Networking**
3. You'll get a URL like: `https://grocery-api-production.up.railway.app`
4. **Copy this URL** - you'll need it for frontend!

### Step 8: Test Backend

Visit your Railway URL + `/docs`:
```
https://grocery-api-production.up.railway.app/docs
```

You should see the Swagger UI! ✅

---

## 🎨 Part 2: Deploy Frontend to Railway

### Step 1: Create Another Service

1. In the **same Railway project**, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose the **same repository** (`Grocery-api-swagger-studio`)
4. Railway will create a second service

### Step 2: Configure Frontend Service

**Root Directory:** `.` (project root)

Railway should auto-detect Vite/React settings.

### Step 3: Set Frontend Environment Variables

Add this variable:

```env
VITE_API_BASE_URL=https://grocery-api-production.up.railway.app
```

**Important:** Use your actual backend URL from Part 1, Step 7!

### Step 4: Configure Build Settings

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run preview
```

Or for production server:
```bash
npx serve -s dist -p $PORT
```

If using serve, add to `package.json`:
```json
{
  "scripts": {
    "start": "npx serve -s dist -p $PORT"
  }
}
```

Then use Start Command: `npm start`

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Railway will build and deploy
3. Get frontend URL from **Settings** → **Generate Domain**

You'll get: `https://grocery-store.up.railway.app`

### Step 6: Update Backend CORS

Go back to **backend service** → **Variables**:

Update `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://grocery-store.up.railway.app,http://localhost:3000
```

Backend will auto-redeploy.

---

## ✅ Verification Checklist

### Backend Checks

- [ ] Visit `https://your-backend.railway.app/docs` - Swagger UI loads
- [ ] Visit `https://your-backend.railway.app/health` - Returns healthy status
- [ ] Try an API endpoint: `https://your-backend.railway.app/api/v1/products`
- [ ] Check PostgreSQL is connected (health endpoint shows DB counts)

### Frontend Checks

- [ ] Visit `https://your-frontend.railway.app` - Home page loads
- [ ] Check base URL shows production URL (not localhost)
- [ ] Click "API Documentation" tab
- [ ] Try "Try It Out" on any endpoint - should work with production data
- [ ] Check Network tab - requests go to production backend

---

## 🔧 Railway Configuration Files

### For Better Control: `railway.json`

Create in **backend directory**:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

### For Frontend: `railway.json`

Create in **project root**:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

---

## 🎥 Quick Setup Commands

If you prefer using Railway CLI:

### Install Railway CLI

```bash
npm install -g @railway/cli
```

### Deploy Backend

```bash
cd backend
railway login
railway init
railway add --plugin postgresql
railway up
```

### Set Variables via CLI

```bash
railway variables set SECRET_KEY="your-secret-key"
railway variables set ENVIRONMENT="production"
railway variables set CORS_ORIGINS="https://your-frontend.railway.app"
```

### Deploy Frontend

```bash
cd ..
railway init
railway variables set VITE_API_BASE_URL="https://your-backend.railway.app"
railway up
```

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
- Check build logs in Railway dashboard
- Ensure `requirements.txt` is in `backend/` directory
- Ensure `package.json` is in project root

### Issue: Backend Returns 500 Error

**Solution:**
1. Check logs in Railway dashboard
2. Verify `DATABASE_URL` is set (auto-set by PostgreSQL plugin)
3. Check `SECRET_KEY` is at least 32 characters

### Issue: CORS Errors

**Solution:**
Update backend `CORS_ORIGINS` with your frontend URL:
```env
CORS_ORIGINS=https://your-frontend.railway.app
```

### Issue: Environment Variables Not Working

**Solution:**
- Railway rebuilds on variable changes
- Wait for redeployment to complete
- Hard refresh browser (Cmd/Ctrl + Shift + R)

### Issue: Database Connection Failed

**Solution:**
1. Ensure PostgreSQL plugin is added
2. Check `DATABASE_URL` variable exists
3. Restart backend service

---

## 💰 Railway Pricing

**Free Tier:**
- $5 free credit per month
- Enough for development/hobby projects
- Sleeps after inactivity

**Pro Plan:**
- $20/month for team use
- No sleep on inactivity
- Better support

---

## 🚀 Post-Deployment

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain: `api.yourdomain.com`
4. Add CNAME record to your DNS:
   ```
   CNAME: api.yourdomain.com → your-app.railway.app
   ```

### Monitoring

- Check **Metrics** tab for CPU/Memory usage
- View **Logs** for debugging
- Set up alerts for downtime

### Database Backups

1. Go to PostgreSQL service
2. **Data** tab shows connection info
3. Use `pg_dump` for backups:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

---

## 📊 Expected Results

**Backend URL:**
```
https://grocery-api-production-abc123.up.railway.app
```

**Frontend URL:**
```
https://grocery-store-xyz789.up.railway.app
```

**API Docs:**
```
https://grocery-api-production-abc123.up.railway.app/docs
```

---

## ✨ Success Checklist

After deployment, you should have:

- ✅ Backend running on Railway with PostgreSQL
- ✅ Frontend running on Railway
- ✅ Environment variables configured
- ✅ CORS properly set
- ✅ APIs working in production
- ✅ Data persisting in PostgreSQL
- ✅ HTTPS enabled automatically
- ✅ Custom domains (optional)

---

## 🎯 Quick Reference

### Backend Environment Variables

```env
DATABASE_URL=<auto-set-by-railway>
SECRET_KEY=<32-char-random-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.railway.app
```

### Frontend Environment Variables

```env
VITE_API_BASE_URL=https://your-backend.railway.app
```

### Important URLs

- Railway Dashboard: https://railway.app/dashboard
- Your Projects: https://railway.app/project
- Docs: https://docs.railway.app

---

## 🎉 You're Live!

Once deployed, share your links:

- **Frontend:** `https://your-frontend.railway.app`
- **API Docs:** `https://your-backend.railway.app/docs`
- **GitHub:** `https://github.com/ArijitSarkar97/Grocery-api-swagger-studio`

**Need help?** Railway has excellent support on their Discord!

---

**Ready to deploy?** Follow the steps above and you'll be live in minutes! 🚀
