# MyMaktab Quran Challenge - Red Award Submission System

A comprehensive web application for tracking daily Quran reading progress with mobile-first design, offline support, and MongoDB integration.

## Features

- 📱 **Mobile-First Design** - Optimized for smartphones and tablets
- 🕌 **Masjid Selection** - Hardwired list + Google Maps search
- 📊 **Real-time Leaderboard** - Track progress across all participants
- 📅 **Calendar View** - Historical reading entries with visual tracking
- ⏱️ **Daily Timer** - Built-in reading timer with session tracking
- 💡 **Reading Ideas** - Daily suggestions and tips
- 🔒 **Parent Verification** - Email accountability for historical entries
- 💾 **Offline Support** - Works without internet connection
- 📈 **Progress Tracking** - Individual and group statistics

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: Google Maps Places API
- **Styling**: Custom CSS with responsive design

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mymaktab-quran-challenge.git
   cd mymaktab-quran-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your:
   - MongoDB connection string
   - Google Maps API key
   - Server port (optional)

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/quran-challenge
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
PORT=3000
```

## API Endpoints

- `POST /api/submissions` - Submit new reading entry
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/submissions/:childName` - Get child's reading history
- `POST /api/historical-entry` - Submit historical reading entry

## Deployment

### Static Hosting (Frontend Only)
Upload `index.html` and assets to:
- Netlify
- Vercel
- GitHub Pages

### Full-Stack Deployment
Deploy to:
- Heroku
- Railway
- DigitalOcean
- AWS

## File Structure

```
mymaktab-quran-challenge/
├── index.html          # Main frontend application
├── server.js           # Backend API server
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── assets/
    └── logo.png        # MyMaktab logo
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mymaktab.com or create an issue on GitHub.

## Acknowledgments

- MyMaktab team for the vision and requirements
- Google Maps API for location services
- MongoDB for reliable data storage
