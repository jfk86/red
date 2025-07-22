# Deployment Guide

## Option 1: Static Hosting (Frontend Only)

### Netlify
1. Create account at netlify.com
2. Drag and drop `index.html` to deploy
3. Custom domain available

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Access at `username.github.io/repo-name`

## Option 2: Full-Stack Deployment

### Heroku
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add MongoDB addon: `heroku addons:create mongolab`
4. Set environment variables:
   ```bash
   heroku config:set GOOGLE_MAPS_API_KEY=your_key
   ```
5. Deploy: `git push heroku main`

### Railway
1. Connect GitHub repository at railway.app
2. Add environment variables in dashboard
3. Automatic deployment on push

### DigitalOcean App Platform
1. Create app from GitHub repository
2. Configure environment variables
3. Set build and run commands

## Environment Variables for Production

Make sure to set these in your hosting platform:
- `MONGODB_URI` - Your MongoDB connection string
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key
- `PORT` - Server port (usually auto-set by hosting platform)

## Database Setup

### MongoDB Atlas (Recommended)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGODB_URI` in environment variables

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/quran-challenge`
