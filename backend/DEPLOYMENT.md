# Production Deployment Guide

## 🚀 Deploying to Railway.app (Recommended)

Railway.app is the easiest way to deploy your FastAPI application with PostgreSQL.

### Steps:

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Install Railway CLI** (Optional)
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy from GitHub** (Recommended)
   - Push your code to GitHub
   - Click "New Project" on Railway
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect it's a Python app

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically creates `DATABASE_URL` environment variable

5. **Set Environment Variables**
   In Railway dashboard, go to your service → Variables:
   ```
   SECRET_KEY=<generate-a-random-32-character-string>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=production
   RATE_LIMIT_REQUESTS=100
   RATE_LIMIT_PERIOD=60
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

   To generate a secure SECRET_KEY:
   ```bash
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

6. **Deploy**
   - Railway automatically deploys on git push
   - Your API will be available at: `https://your-app.railway.app`

---

## 🔧 Deploying to Render.com

### Steps:

1. **Create Render Account**
   - Visit https://render.com
   - Sign up

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Build Settings**
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add PostgreSQL Database**
   - Go to Dashboard → "New +" → "PostgreSQL"
   - Copy the "InternalDatabase URL"

5. **Set Environment Variables**
   ```
   DATABASE_URL=<your-postgresql-url-from-render>
   SECRET_KEY=<generate-random-key>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend.com
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

---

## 🐳 Deploying with Docker (Any Platform)

### Create Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
# Build image
docker build -t grocery-api .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e SECRET_KEY="your-secret" \
  grocery-api
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] **Change SECRET_KEY** - Generate a strong random key
- [ ] **Use PostgreSQL** - Not SQLite
- [ ] **Set ENVIRONMENT=production** - Disables debug features
- [ ] **Configure CORS_ORIGINS** - Only allow your frontend domain
- [ ] **Enable HTTPS** - Use a reverse proxy (Nginx, Caddy) or platform SSL
- [ ] **Add rate limiting** - Already implemented with slowapi
- [ ] **Monitor logs** - Set up logging service
- [ ] **Backup database** - Regular automated backups
- [ ] **Update dependencies** - Keep packages up to date

---

## 🗄️ Database Migration

### From SQLite to PostgreSQL

1. **Export data from SQLite**
   ```bash
   sqlite3 grocery_store.db .dump > data.sql
   ```

2. **Create PostgreSQL database** on your platform

3. **Update DATABASE_URL** in environment variables
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

4. **The app will auto-create tables** on first run

5. **Import data** (if needed)
   ```bash
   psql $DATABASE_URL < data.sql
   ```

---

## 📊 Monitoring & Logging

### Add Sentry (Error Tracking)

```bash
pip install sentry-sdk[fastapi]
```

```python
# In main.py
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment=settings.environment,
)
```

### Add Logging Service

- **LogFlare**: Free tier available
- **Papertrail**: Simple log aggregation
- **Datadog**: Enterprise monitoring

---

## 🌐 Frontend Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

3. **Set Environment Variable**
   ```
   VITE_API_URL=https://your-api.railway.app
   ```

4. **Deploy**
   ```bash
   vercel
   ```

### Update Frontend API URL

Create `.env.production`:
```
VITE_API_URL=https://your-api.railway.app
```

Update `services/realApi.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## 🧪 Testing Production Deploy

### 1. Health Check
```bash
curl https://your-api.railway.app/health
```

### 2. Test API Endpoints
```bash
# Get products
curl https://your-api.railway.app/api/v1/products

# Register user
curl -X POST https://your-api.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST https://your-api.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### 3. Load Testing
```bash
# Install Apache Bench
brew install httpd  # macOS

# Test
ab -n 1000 -c 10 https://your-api.railway.app/api/v1/products
```

---

## 📝 Post-Deployment Checklist

- [ ] API is accessible (no 502/503 errors)
- [ ] Database is connected (check /health endpoint)
- [ ] Authentication works (register/login)
- [ ] CORS is configured (frontend can make requests)
- [ ] Rate limiting is active
- [ ] Logs are being recorded
- [ ] SSL/HTTPS is enabled
- [ ] Environment variables are set correctly
- [ ] Frontend is deployed and connected
- [ ] Database backups are configured

---

## 🆘 Troubleshooting

### Issue: "Module not found"
**Solution:** Ensure all dependencies in `requirements.txt`
```bash
pip freeze > requirements.txt
```

### Issue: "Database connection failed"
**Solution:** Check DATABASE_URL format
```
PostgreSQL: postgresql://user:pass@host:5432/dbname
SQLite: sqlite:///./database.db
```

### Issue: "CORS errors"
**Solution:** Add frontend domain to CORS_ORIGINS
```
CORS_ORIGINS=https://yourfrontend.vercel.app,http://localhost:3000
```

### Issue: "Rate limit errors"
**Solution:** Adjust rate limits in .env
```
RATE_LIMIT_REQUESTS=500
RATE_LIMIT_PERIOD=60
```

---

## 📞 Support

For deployment issues:
- Railway: https://railway.app/help
- Render: https://render.com/docs
- FastAPI: https://fastapi.tiangolo.com/deployment/

---

## 🎉 You're Live!

Your production-ready Grocery Store API is now deployed with:
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ HTTPS
- ✅ Error handling
- ✅ Logging
- ✅ Environment variables

**API URL:** `https://your-api.railway.app`  
**Docs:** `https://your-api.railway.app/docs` (dev only)  
**Health:** `https://your-api.railway.app/health`
