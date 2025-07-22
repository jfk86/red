# MyMaktab Quran Challenge - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Heroku (Recommended)

#### Prerequisites
- Heroku account
- Git installed
- MongoDB Atlas account

#### Step 1: Prepare Your Repository
1. Ensure all files are in your GitHub repository:
   - `index.html` (your frontend)
   - `server.js` (backend API)
   - `package.json` (dependencies)
   - `Procfile` (Heroku config)
   - `.env.example` (environment template)

#### Step 2: Create Heroku App
1. Go to [dashboard.heroku.com](https://dashboard.heroku.com)
2. Click "New" → "Create new app"
3. Choose app name: `mymaktab-quran-challenge`
4. Select region (US or Europe)

#### Step 3: Connect to GitHub
1. Go to "Deploy" tab
2. Select "GitHub" as deployment method
3. Connect your repository
4. Enable automatic deploys (optional)

#### Step 4: Set Environment Variables
1. Go to "Settings" tab
2. Click "Reveal Config Vars"
3. Add these variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `PORT`: (automatically set by Heroku)

#### Step 5: Deploy
1. Go to "Deploy" tab
2. Click "Deploy Branch" (main branch)
3. Wait for build to complete
4. Click "View" to see your live app

### Option 2: Netlify (Frontend Only)

For static hosting of just the frontend:

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `index.html` file
3. Your site will be live instantly
4. Custom domain available in settings

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your app will be deployed

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)

### Step 2: Configure Database
1. Create database user with username/password
2. Add IP address to whitelist (0.0.0.0/0 for all IPs)
3. Get connection string from "Connect" button

### Step 3: Update Environment Variables
Replace the connection string in your environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quran-challenge?retryWrites=true&w=majority
```

## 🔧 Environment Variables

Create a `.env` file in your project root with:

```env
# MongoDB Atlas Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Server Configuration (optional - Heroku sets this automatically)
PORT=3000
```

## 🧪 Testing Your Deployment

### Health Check
Visit: `https://your-app-name.herokuapp.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "MyMaktab Quran Challenge API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Form Submission
1. Fill out the form on your website
2. Submit a reading entry
3. Check if it appears in the leaderboard

### Test Leaderboard
Visit: `https://your-app-name.herokuapp.com/api/leaderboard`

## 🔍 Troubleshooting

### Common Issues

#### Build Fails
- Check `package.json` has correct dependencies
- Ensure `Procfile` exists with: `web: node server.js`
- Verify Node.js version in engines

#### Database Connection Fails
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

#### App Crashes
- Check Heroku logs: `heroku logs --tail`
- Verify environment variables are set
- Check for syntax errors in code

### Heroku CLI Commands

```bash
# View logs
heroku logs --tail --app your-app-name

# Restart app
heroku restart --app your-app-name

# Check config vars
heroku config --app your-app-name

# Set config var
heroku config:set MONGODB_URI=your_connection_string --app your-app-name
```

## 📱 Mobile Optimization

Your app is already mobile-optimized with:
- Responsive design
- Touch-friendly interface
- Mobile-first approach
- Fast loading times

## 🔒 Security Features

- CORS enabled for cross-origin requests
- Input validation on all forms
- MongoDB injection protection
- Environment variables for sensitive data

## 📊 Monitoring

### Heroku Metrics
- View app performance in Heroku dashboard
- Monitor response times and throughput
- Check error rates

### MongoDB Atlas Monitoring
- Database performance metrics
- Connection monitoring
- Query performance insights

## 🚀 Going Live Checklist

- [ ] All files uploaded to GitHub
- [ ] Heroku app created and connected
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Database connection tested
- [ ] Form submission tested
- [ ] Leaderboard working
- [ ] Mobile responsiveness verified
- [ ] Custom domain configured (optional)

## 📞 Support

For deployment issues:
- Check Heroku documentation
- Review MongoDB Atlas guides
- Verify all environment variables
- Test API endpoints individually

Your MyMaktab Quran Challenge app is now ready for students worldwide! 🕌📚
