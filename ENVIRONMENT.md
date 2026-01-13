# Environment Configuration Guide

This guide explains how to configure the API base URL for different environments.

## 🔧 How It Works

The application uses environment variables to automatically configure the correct API URL based on where it's deployed.

### Configuration File

`config/api.ts` - Centralized API configuration that reads from environment variables

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  // Automatically uses environment variable or falls back to localhost
}
```

## 📝 Environment Variables

### Local Development

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Note:** This file is gitignored and won't be committed to version control.

### Production Deployment

Set the environment variable on your hosting platform:

#### Vercel
```env
VITE_API_BASE_URL=https://your-api.railway.app
```

1. Go to Project Settings → Environment Variables
2. Add `VITE_API_BASE_URL` with your production backend URL
3. Redeploy

#### Netlify
```env
VITE_API_BASE_URL=https://your-api.onrender.com
```

1. Go to Site Settings → Environment Variables
2. Add `VITE_API_BASE_URL`
3. Trigger a new deploy

#### Railway (Frontend)
```env
VITE_API_BASE_URL=https://your-api.railway.app
```

1. Go to your service → Variables
2. Add `VITE_API_BASE_URL`
3. Redeploy

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

Deploy your FastAPI backend to Railway/Render/Heroku:

```bash
# Example Railway commands
cd backend
railway login
railway init
railway up
```

You'll get a URL like: `https://grocery-api-production.up.railway.app`

### Step 2: Configure Frontend

Update your frontend's environment variable:

**For Vercel:**
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://grocery-api-production.up.railway.app
```

**For Netlify:**
```bash
# In Netlify UI:
# Site Settings → Environment → Add Variable
# Key: VITE_API_BASE_URL
# Value: https://grocery-api-production.up.railway.app
```

### Step 3: Deploy Frontend

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

## ✅ Automatic Features

Once configured, the following automatically update:

- ✅ Base URL display in API Documentation
- ✅ All API requests from `realApi.ts`
- ✅ Copy buttons (copies production URL)
- ✅ "Try It Out" feature (uses production API)

## 🧪 Testing

### Test Local Configuration

```bash
# Terminal 1 - Backend
cd backend
./venv/bin/uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev
```

Visit http://localhost:3000 - should connect to local backend

### Test Production Configuration

Set environment variable and build:

```bash
VITE_API_BASE_URL=https://your-api.railway.app npm run build
npm run preview
```

The preview should connect to your production API.

## 🔍 Verification

**Check Current Configuration:**

Open browser console on your deployed site:

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show your production URL
```

**Check API Calls:**

Look in Network tab - all requests should go to your production URL.

## 🐛 Troubleshooting

### Issue: Still using localhost in production

**Solution:**
1. Ensure `VITE_API_BASE_URL` is set in your hosting platform
2. Rebuild the application (environment variables are baked into the build)
3. Clear cache and hard reload

### Issue: CORS errors in production

**Solution:**
Update backend `CORS_ORIGINS` environment variable:

```python
# backend/.env (production)
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Issue: Environment variable not working

**Solution:**
- Vite requires `VITE_` prefix for custom env vars
- Rebuild after changing environment variables
- Check variable name is exactly `VITE_API_BASE_URL`

## 📚 Examples

### Multiple Environments

You can have different env files:

**`.env.local`** (Local development)
```env
VITE_API_BASE_URL=http://localhost:8000
```

**`.env.staging`** (Staging)
```env
VITE_API_BASE_URL=https://staging-api.railway.app
```

**`.env.production`** (Production - set in hosting platform)
```env
VITE_API_BASE_URL=https://api.yourcompany.com
```

### Build for Specific Environment

```bash
# Production
VITE_API_BASE_URL=https://api.production.com npm run build

# Staging
VITE_API_BASE_URL=https://api.staging.com npm run build
```

## ✨ Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use `.env.example`** - Document required variables
3. **Set in hosting platform** - Use platform's environment variable UI
4. **Rebuild after changes** - Env vars are build-time, not runtime
5. **Use HTTPS in production** - Always use secure URLs

## 🎯 Summary

- **Development:** Uses `http://localhost:8000` (default)
- **Production:** Uses `VITE_API_BASE_URL` from environment
- **Automatic:** All URLs update based on configuration
- **No code changes needed** - Just set the environment variable!

---

**Ready to deploy?** Follow the steps above and your frontend will automatically use the correct API URL! 🚀
