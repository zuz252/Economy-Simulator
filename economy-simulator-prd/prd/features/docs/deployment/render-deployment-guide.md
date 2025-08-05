# Render Deployment Guide

## 🚀 Deploying the Economy Simulator Backend to Render

### Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Supabase Account**: For database (already set up)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Render to access your GitHub repositories

### Step 2: Create New Web Service

1. **Dashboard**: Click "New +" button
2. **Service Type**: Select "Web Service"
3. **Connect Repository**: 
   - Choose "Connect a Git repository"
   - Select your `Economy-Simulator` repository
   - Choose the `main` branch

### Step 3: Configure the Service

**Basic Settings:**
- **Name**: `economy-simulator-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)

**Build & Deploy Settings:**
- **Build Command**: `cd src/backend && npm install && npm run build`
- **Start Command**: `cd src/backend && npm start`
- **Root Directory**: Leave empty (we'll specify in build command)

### Step 4: Environment Variables

Add these environment variables in the Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment |
| `PORT` | `10000` | Server port |
| `SUPABASE_URL` | `your_supabase_url` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key` | Supabase service key |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Frontend URL for CORS |

### Step 5: Get Supabase Credentials

1. **Go to Supabase Dashboard**: [supabase.com](https://supabase.com)
2. **Select your project**
3. **Settings → API**:
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 6: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Check logs** for any errors
4. **Test the health endpoint**: `https://your-service.onrender.com/health`

### Step 7: Update Frontend Configuration

Once deployed, update your frontend environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
```

### Step 8: Test the Deployment

**Health Check:**
```bash
curl https://your-service.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Troubleshooting

#### Common Issues:

1. **Build Fails**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables Missing**:
   - Double-check all required variables are set
   - Ensure no typos in variable names

3. **CORS Errors**:
   - Verify `FRONTEND_URL` is set correctly
   - Check that frontend URL matches exactly

4. **Database Connection Issues**:
   - Verify Supabase credentials
   - Check if database tables exist
   - Ensure service role key has proper permissions

#### Logs and Debugging:

1. **View Logs**: Render dashboard → Your service → Logs
2. **Real-time logs**: Click "Live" tab
3. **Build logs**: Check "Build" tab for compilation errors

### Cost Information

**Free Tier Limits:**
- 750 hours/month (enough for 24/7 usage)
- 512MB RAM
- Shared CPU
- Automatic sleep after 15 minutes of inactivity

**Upgrade Options:**
- **Starter**: $7/month (always on, 512MB RAM)
- **Standard**: $25/month (always on, 1GB RAM)

### Next Steps

1. **Set up Supabase database tables**
2. **Configure frontend to use new backend URL**
3. **Test all API endpoints**
4. **Set up monitoring and alerts**

### Useful Commands

**Check deployment status:**
```bash
# Via web dashboard or API
curl https://api.render.com/v1/services/YOUR_SERVICE_ID
```

**Redeploy:**
```bash
# Via Render dashboard → Manual Deploy
```

**View logs:**
```bash
# Via Render dashboard → Logs tab
```

### Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Only allow your frontend domain
3. **Rate Limiting**: Consider adding rate limiting for production
4. **HTTPS**: Render provides automatic HTTPS
5. **Database**: Use Supabase Row Level Security (RLS)

### Monitoring

1. **Health Checks**: Render automatically checks `/health` endpoint
2. **Logs**: Monitor application logs in Render dashboard
3. **Metrics**: View performance metrics in Render dashboard
4. **Alerts**: Set up alerts for downtime or errors

---

## 🎯 **Ready to Deploy?**

Follow these steps in order:
1. ✅ Create Render account
2. ✅ Connect GitHub repository  
3. ✅ Configure web service
4. ✅ Set environment variables
5. ✅ Deploy and test
6. ✅ Update frontend configuration

**Need help?** Check the troubleshooting section or Render's documentation at [render.com/docs](https://render.com/docs) 