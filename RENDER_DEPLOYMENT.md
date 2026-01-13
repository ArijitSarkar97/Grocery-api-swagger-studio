# 🎨 Render.com Deployment Guide

Complete step-by-step guide to deploy your Grocery Store API to Render.com.

## 📋 Prerequisites

- GitHub account with your code pushed
- Render.com account (sign up at https://render.com)
- Your project on GitHub: `https://github.com/ArijitSarkar97/Grocery-api-swagger-studio`

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Create PostgreSQL Database

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in details:
   - **Name:** `grocery-api-db`
   - **Database:** `grocery_db`
   - **User:** `grocery_user`
   - **Region:** Choose closest to you
   - **Instance Type:** Free
4. Click **"Create Database"**
5. Wait for database to provision (1-2 minutes)

### Step 2: Get Database Connection String

1. Click on your new database
2. Scroll to **"Connections"** section
3. Copy the **"Internal Database URL"** (starts with `postgresql://`)
4. **Save this URL** - you'll need it in Step 4!

Example:
```
postgresql://grocery_user:xxxxxxxxxxxx@dpg-xxxxx-a.oregon-postgres.render.com/grocery_db
```

### Step 3: Create Web Service for Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select **"Grocery-api-swagger-studio"**
4. Configure settings:

**Basic Settings:**
- **Name:** `grocery-api-backend`
- **Region:** Same as database
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`

**Build & Deploy:**
- **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```

- **Start Command:**
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select **"Free"** (or paid for production)

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```env
DATABASE_URL=<paste-your-internal-database-url-from-step-2>
SECRET_KEY=<generate-random-32-char-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.onrender.com
```

**Generate SECRET_KEY:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
# Copy the output
```

**Important:** Update `CORS_ORIGINS` after deploying frontend (Part 2)

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start the server
3. Wait for deployment (3-5 minutes)

### Step 6: Get Backend URL

After deployment completes:
1. Look at the top of your service page
2. Your URL will be like: `https://grocery-api-backend.onrender.com`
3. **Copy this URL** - you'll need it for frontend!

### Step 7: Test Backend

Visit your Render URL + `/docs`:
```
https://grocery-api-backend.onrender.com/docs
```

You should see the Swagger UI! ✅

**Test Health Check:**
```
https://grocery-api-backend.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "environment": "production",
  "database": "connected",
  ...
}
```

---

## 🎨 Part 2: Deploy Frontend to Render

### Step 1: Create Static Site

1. Click **"New +"** → **"Static Site"**
2. Connect the **same GitHub repository**
3. Configure settings:

**Basic Settings:**
- **Name:** `grocery-store-frontend`
- **Branch:** `main`
- **Root Directory:** (leave empty - use project root)

**Build & Deploy:**
- **Build Command:**
  ```bash
  npm install && npm run build
  ```

- **Publish Directory:**
  ```
  dist
  ```

### Step 2: Add Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

```env
VITE_API_BASE_URL=https://grocery-api-backend.onrender.com
```

**Important:** Use your actual backend URL from Part 1, Step 6!

### Step 3: Deploy Frontend

1. Click **"Create Static Site"**
2. Render will build and deploy
3. Wait for deployment (2-3 minutes)

### Step 4: Get Frontend URL

Your frontend will be available at:
```
https://grocery-store-frontend.onrender.com
```

### Step 5: Update Backend CORS

Go back to **backend web service** → **Environment**:

Update `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://grocery-store-frontend.onrender.com,http://localhost:3000
```

Click **"Save Changes"** - backend will auto-redeploy.

---

## ✅ Verification Checklist

### Backend Checks

- [ ] Visit `https://your-backend.onrender.com/docs` - Swagger UI loads
- [ ] Visit `https://your-backend.onrender.com/health` - Returns healthy status
- [ ] Try API: `https://your-backend.onrender.com/api/v1/products`
- [ ] Check database connection (health endpoint shows counts)

### Frontend Checks

- [ ] Visit `https://your-frontend.onrender.com` - Home page loads
- [ ] Base URL shows production URL (not localhost)
- [ ] API Documentation tab works
- [ ] "Try It Out" works with production data
- [ ] Network tab shows requests to production backend

---

## 🔧 Render Configuration Files

### Backend: `render.yaml` (Optional)

Create in project root for Infrastructure as Code:

```yaml
services:
  # Backend API
  - type: web
    name: grocery-api-backend
    runtime: python
    plan: free
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
    envVars:
      - key: ALGORITHM
        value: HS256
      - key: ACCESS_TOKEN_EXPIRE_MINUTES
        value: 30
      - key: ENVIRONMENT
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: grocery-api-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: CORS_ORIGINS
        value: https://grocery-store-frontend.onrender.com

  # Frontend
  - type: web
    name: grocery-store-frontend
    runtime: static
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://grocery-api-backend.onrender.com

databases:
  - name: grocery-api-db
    plan: free
    databaseName: grocery_db
    user: grocery_user
```

With `render.yaml`, you can deploy with one click via "Blueprint"!

---

## 🎯 Render Dashboard Features

### Service Logs

- Real-time logs in **"Logs"** tab
- Filter by time/severity
- Download logs for debugging

### Metrics

- **"Metrics"** tab shows:
  - CPU usage
  - Memory usage
  - Request count
  - Response times

### Auto-Deploy

- **"Settings"** → **"Build & Deploy"**
- Toggle **"Auto-Deploy"**: Yes
- Every push to `main` = automatic deployment

### Custom Domains

1. Go to **"Settings"** → **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter: `api.yourdomain.com`
4. Add DNS records as shown:
   ```
   CNAME: api → grocery-api-backend.onrender.com
   ```

### Environment Groups (Advanced)

Create environment groups for shared variables:
1. Dashboard → **"Environment Groups"**
2. Create group with common variables
3. Link to multiple services

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify database is running (green status)
2. Check `DATABASE_URL` is the **Internal URL**
3. Ensure backend and database are in same region
4. Check connection string format

### Issue: Build Fails

**Solution:**
- Check **"Logs"** for detailed error
- Ensure `requirements.txt` exists in `backend/`
- Verify Python version compatibility
- Check for missing dependencies

### Issue: Frontend Shows 404 on Refresh

**Solution:**
Add `_redirects` file in `public/` folder:
```
/*    /index.html   200
```

This handles client-side routing.

### Issue: CORS Errors

**Solution:**
Update backend `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://your-frontend.onrender.com
```

Remember to save and wait for redeploy!

### Issue: Slow Cold Starts (Free Tier)

**Explanation:**
- Free tier spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Solution: Upgrade to paid plan or use cron job to keep alive

**Keep-Alive Script:**
```bash
# Add to a cron service like cron-job.org
curl https://your-backend.onrender.com/health
```

---

## 💰 Render Pricing

### Free Tier

**Web Services:**
- 750 compute hours/month
- Spins down after 15 min inactivity
- Shared CPU/RAM
- Perfect for development

**PostgreSQL:**
- 90 days free (then paid)
- 1GB storage
- Shared resources

**Static Sites:**
- Unlimited bandwidth
- Global CDN
- Always free!

### Paid Plans

**Starter ($7/month per service):**
- No spin down
- Dedicated resources
- Better performance

**PostgreSQL ($7/month):**
- After free 90 days
- 1GB storage
- Automated backups

---

## 🔐 Security Best Practices

### 1. Environment Variables

✅ **DO:**
- Use Render's environment variables
- Generate strong SECRET_KEY
- Use Internal Database URL

❌ **DON'T:**
- Hardcode secrets in code
- Commit `.env` files
- Use weak passwords

### 2. Database Security

- Use **Internal Database URL** for backend
- Don't expose database publicly
- Enable SSL (auto-enabled on Render)

### 3. CORS Configuration

- Whitelist only your frontend domain
- Don't use `*` in production
- Update after domain changes

---

## 📊 Expected Results

After deployment:

**Backend:**
```
https://grocery-api-backend.onrender.com
```

**Frontend:**
```
https://grocery-store-frontend.onrender.com
```

**API Documentation:**
```
https://grocery-api-backend.onrender.com/docs
```

**Database:**
```
Internal: postgresql://...@...oregon-postgres.render.com/grocery_db
```

---

## 🚀 Post-Deployment

### Monitor Your App

**Set up notifications:**
1. Service → **"Settings"** → **"Notifications"**
2. Add email for:
   - Deploy failures
   - Health check failures
   - Resource alerts

### Database Backups

**Manual Backup:**
```bash
pg_dump <DATABASE_URL> > backup.sql
```

**Automated:** Available in paid plans

### Performance Optimization

1. **Enable CDN** - Static site auto-uses CDN
2. **Health Checks** - Already configured via `/health`
3. **Compression** - Enable gzip in FastAPI
4. **Caching** - Add Redis (optional)

---

## 🎓 Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | 750 hrs/month | $5 credit/month |
| PostgreSQL | 90 days free | Included |
| Spin Down | 15 min idle | Similar |
| Static Sites | Free forever | Pay per use |
| UI/UX | More detailed | Simpler |
| Best For | Static sites | All-in-one |

**Recommendation:**
- **Render:** Better for static sites + API
- **Railway:** Better for all backend services

---

## ✨ Success Checklist

- ✅ PostgreSQL database created
- ✅ Backend deployed and running
- ✅ Frontend deployed
- ✅ Environment variables configured
- ✅ CORS properly set
- ✅ HTTPS enabled (automatic)
- ✅ APIs working in production
- ✅ Database connected and seeded

---

## 🎯 Quick Commands

### Deploy via Render CLI

```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Create services from render.yaml
render blueprint deploy
```

### Check Service Status

```bash
render services list
render service logs grocery-api-backend
```

### Update Environment Variable

```bash
render env set CORS_ORIGINS=https://new-url.com --service grocery-api-backend
```

---

## 📞 Support

**Render Resources:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com
- Support: support@render.com

**Common Links:**
- Dashboard: https://dashboard.render.com
- Pricing: https://render.com/pricing
- Tutorials: https://render.com/docs/deploy-python

---

## 🎉 You're Live on Render!

Your app is now deployed with:
- ✅ Production-grade PostgreSQL
- ✅ Auto HTTPS/SSL
- ✅ Global CDN for frontend
- ✅ Auto-deploy on git push
- ✅ Free tier for development

**Share your links:**
- Frontend: `https://your-frontend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`
- GitHub: `https://github.com/ArijitSarkar97/Grocery-api-swagger-studio`

---

**Ready to deploy?** Follow the steps above and you'll be live in 10 minutes! 🚀
