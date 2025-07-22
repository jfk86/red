# Heroku Deployment Guide 🚀

## Prerequisites
- Heroku account (free at heroku.com)
- Heroku CLI installed
- Git installed

## Step 1: Install Heroku CLI

### Windows
Download from: https://devcenter.heroku.com/articles/heroku-cli

### Mac
```bash
brew tap heroku/brew && brew install heroku
```

### Linux
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

## Step 2: Login to Heroku
```bash
heroku login
```

## Step 3: Prepare Your Repository

1. **Upload new files to GitHub:**
   - `Procfile` (tells Heroku how to start your app)
   - Updated `package.json` (with Node.js version)

2. **Clone your repository locally:**
   ```bash
   git clone https://github.com/jfk86/red.git
   cd red
   ```

## Step 4: Create Heroku App
```bash
# Create app with a unique name
heroku create your-app-name-here

# Or let Heroku generate a name
heroku create
```

## Step 5: Set Environment Variables
```bash
# Set MongoDB connection
heroku config:set MONGODB_URI="mongodb+srv://qurancloud-admin:.c2Set%23S-r3xY%25%40@cluster0.pucic.mongodb.net/quran-challenge?retryWrites=true&w=majority"

# Set Google Maps API key
heroku config:set GOOGLE_MAPS_API_KEY="AIzaSyBvOkBwgdtTBHaIkKMaFGveHtPjMUxfeXE"

# Verify environment variables
heroku config
```

## Step 6: Deploy to Heroku
```bash
# Add Heroku remote (if not done automatically)
heroku git:remote -a your-app-name

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## Step 7: Open Your App
```bash
heroku open
```

## Step 8: Monitor Logs
```bash
# View real-time logs
heroku logs --tail

# View recent logs
heroku logs
```

## Alternative: Deploy from GitHub (No CLI needed)

1. **Go to Heroku Dashboard**
2. **Create New App**
3. **Connect to GitHub** in Deploy tab
4. **Select your repository:** `jfk86/red`
5. **Set Environment Variables** in Settings tab:
   - `MONGODB_URI` = `mongodb+srv://qurancloud-admin:.c2Set%23S-r3xY%25%40@cluster0.pucic.mongodb.net/quran-challenge?retryWrites=true&w=majority`
   - `GOOGLE_MAPS_API_KEY` = `AIzaSyBvOkBwgdtTBHaIkKMaFGveHtPjMUxfeXE`
6. **Enable Automatic Deploys**
7. **Manual Deploy** from main branch

## Troubleshooting

### App Won't Start
```bash
heroku logs --tail
```
Common issues:
- Missing `Procfile`
- Wrong start script in `package.json`
- Environment variables not set

### Database Connection Issues
```bash
heroku config
```
Verify `MONGODB_URI` is set correctly

### Port Issues
Heroku automatically sets `PORT` environment variable. Your server.js already handles this:
```javascript
const PORT = process.env.PORT || 3000;
```

## Expected Result ✅

Your app will be live at: `https://your-app-name.herokuapp.com`

Features that will work:
- ✅ Quran reading submissions
- ✅ Real-time leaderboard
- ✅ Calendar view
- ✅ Google Maps masjid search
- ✅ MongoDB data persistence
- ✅ Mobile-responsive design

## Post-Deployment Testing

Test these URLs (replace with your actual Heroku URL):
```bash
# Main app
https://your-app-name.herokuapp.com

# API endpoints
https://your-app-name.herokuapp.com/api/leaderboard
https://your-app-name.herokuapp.com/api/submissions
```

## Custom Domain (Optional)

1. **Add custom domain:**
   ```bash
   heroku domains:add www.yourdomain.com
   ```

2. **Configure DNS** with your domain provider
3. **Add SSL certificate** (automatic with Heroku)

Your MyMaktab Quran Challenge app will be live and ready for users! 🎉
