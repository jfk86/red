const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// MongoDB Schemas
const ReadingSchema = new mongoose.Schema({
    masjid: {
        type: String,
        required: true,
        trim: true
    },
    childName: {
        type: String,
        required: true,
        trim: true
    },
    readingTypes: [{
        type: String,
        enum: ['Dua', 'Hadith', 'Quran', 'Hifdh'],
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    masjid: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['parent', 'imam', 'admin'],
        default: 'parent'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const Reading = mongoose.model('Reading', ReadingSchema);
const User = mongoose.model('User', UserSchema);

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Quran Challenge API is running!',
        timestamp: new Date().toISOString()
    });
});

// Submit reading
app.post('/api/readings', async (req, res) => {
    try {
        const { masjid, childName, readingTypes } = req.body;

        // Validation
        if (!masjid || !childName || !readingTypes || readingTypes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide masjid, child name, and at least one reading type'
            });
        }

        // Create new reading
        const reading = new Reading({
            masjid: masjid.trim(),
            childName: childName.trim(),
            readingTypes,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        await reading.save();

        res.status(201).json({
            success: true,
            message: 'Reading logged successfully!',
            data: {
                id: reading._id,
                masjid: reading.masjid,
                childName: reading.childName,
                readingTypes: reading.readingTypes,
                date: reading.date
            }
        });

    } catch (error) {
        console.error('Error saving reading:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save reading. Please try again.'
        });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Reading.aggregate([
            {
                $group: {
                    _id: '$masjid',
                    totalReadings: { $sum: { $size: '$readingTypes' } },
                    uniqueChildren: { $addToSet: '$childName' },
                    lastReading: { $max: '$date' }
                }
            },
            {
                $project: {
                    masjid: '$_id',
                    totalReadings: 1,
                    uniqueChildren: { $size: '$uniqueChildren' },
                    lastReading: 1,
                    _id: 0
                }
            },
            {
                $sort: { totalReadings: -1 }
            },
            {
                $limit: 20
            }
        ]);

        res.json({
            success: true,
            data: leaderboard
        });

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard'
        });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await Reading.aggregate([
            {
                $group: {
                    _id: null,
                    totalReadings: { $sum: { $size: '$readingTypes' } },
                    totalChildren: { $addToSet: '$childName' },
                    totalMasjids: { $addToSet: '$masjid' },
                    readingsByType: {
                        $push: {
                            $map: {
                                input: '$readingTypes',
                                as: 'type',
                                in: '$$type'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    totalReadings: 1,
                    totalChildren: { $size: '$totalChildren' },
                    totalMasjids: { $size: '$totalMasjids' },
                    readingsByType: {
                        $reduce: {
                            input: '$readingsByType',
                            initialValue: [],
                            in: { $concatArrays: ['$$value', '$$this'] }
                        }
                    },
                    _id: 0
                }
            }
        ]);

        // Count readings by type
        const readingsByType = {};
        if (stats[0] && stats[0].readingsByType) {
            stats[0].readingsByType.forEach(type => {
                readingsByType[type] = (readingsByType[type] || 0) + 1;
            });
        }

        res.json({
            success: true,
            data: {
                ...stats[0],
                readingsByType
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name, masjid, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
            masjid,
            role: role || 'parent'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    masjid: user.masjid,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    masjid: user.masjid,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🏆 Leaderboard API: http://localhost:${PORT}/api/leaderboard`);
});

module.exports = app;
