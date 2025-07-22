const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MongoDB connection
let db;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('quran-challenge');
        console.log('✅ Connected to MongoDB Atlas successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'MyMaktab Quran Challenge API is running!',
        timestamp: new Date().toISOString()
    });
});

// Submit reading entry
app.post('/api/submissions', async (req, res) => {
    try {
        const { childName, masjid, categories, description, imamVerified, bulkSubmission } = req.body;

        // Validation
        if (!childName || !masjid || !categories || categories.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please provide child name, masjid, and at least one reading category'
            });
        }

        // Create submission document
        const submission = {
            childName: childName.trim(),
            masjid: masjid.trim(),
            categories: categories,
            description: description || '',
            imamVerified: imamVerified || false,
            bulkSubmission: bulkSubmission || false,
            submissionDate: new Date(),
            timestamp: new Date()
        };

        // Insert into database
        const result = await db.collection('submissions').insertOne(submission);

        res.status(201).json({
            success: true,
            message: 'Reading submission recorded successfully!',
            submission: {
                _id: result.insertedId,
                ...submission
            }
        });

    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save submission. Please try again.'
        });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await db.collection('submissions').aggregate([
            {
                $group: {
                    _id: '$childName',
                    masjid: { $first: '$masjid' },
                    totalReadings: { $sum: { $size: '$categories' } },
                    lastReading: { $max: '$submissionDate' },
                    totalSubmissions: { $sum: 1 }
                }
            },
            {
                $project: {
                    childName: '$_id',
                    masjid: 1,
                    totalReadings: 1,
                    lastReading: 1,
                    totalSubmissions: 1,
                    _id: 0
                }
            },
            {
                $sort: { totalReadings: -1, lastReading: -1 }
            },
            {
                $limit: 50
            }
        ]).toArray();

        res.json(leaderboard);

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch leaderboard'
        });
    }
});

// Get child's reading history
app.get('/api/submissions/:childName', async (req, res) => {
    try {
        const childName = req.params.childName;

        const submissions = await db.collection('submissions')
            .find({ childName: childName })
            .sort({ submissionDate: -1 })
            .toArray();

        res.json(submissions);

    } catch (error) {
        console.error('Error fetching child submissions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reading history'
        });
    }
});

// Submit historical entry
app.post('/api/historical-entry', async (req, res) => {
    try {
        const { childName, masjid, categories, description, parentEmail, readingDate } = req.body;

        // Validation
        if (!childName || !masjid || !categories || !parentEmail || !readingDate) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields including parent email'
            });
        }

        // Create historical entry
        const historicalEntry = {
            childName: childName.trim(),
            masjid: masjid.trim(),
            categories: categories,
            description: description || '',
            parentEmail: parentEmail.trim(),
            readingDate: new Date(readingDate),
            submissionDate: new Date(),
            isHistorical: true
        };

        // Insert into database
        const result = await db.collection('historical_entries').insertOne(historicalEntry);

        res.status(201).json({
            success: true,
            message: 'Historical reading entry recorded successfully!',
            entry: {
                _id: result.insertedId,
                ...historicalEntry
            }
        });

    } catch (error) {
        console.error('Error saving historical entry:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save historical entry. Please try again.'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 MyMaktab Quran Challenge Server running on port ${PORT}`);
        console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
        console.log(`🏆 Leaderboard API: http://localhost:${PORT}/api/leaderboard`);
    });
});

module.exports = app;
