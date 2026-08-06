const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); // DNS fix for MongoDB SRV lookups

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ACTIVITY LOGGING (Node.js fs module)
// ==========================================
// Vercel serverless functions have a read-only filesystem except /tmp,
// so we write logs there when running on Vercel, and to a local folder
// otherwise. If directory creation fails for any reason, logging is
// disabled instead of crashing the server.
const LOG_DIR = process.env.VERCEL ? path.join(os.tmpdir(), 'eduflow-logs') : path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'activity.log');

let loggingEnabled = true;
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Could not initialize log directory, disabling file logging:', err.message);
  loggingEnabled = false;
}

app.use((req, res, next) => {
  if (loggingEnabled) {
    const entry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
    fs.appendFile(LOG_FILE, entry, (err) => {
      if (err) console.error('Log write error:', err);
    });
  }
  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// MONGOOSE SCHEMAS & MODELS
// ==========================================

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Student' },
    role: { type: String, default: 'student' },
    classOrSubject: { type: String, default: 'MCA' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// Assignment Schema
const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    user: { type: String, default: 'Anonymous' },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

// Peer Radar Session Schema
const sessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    locationName: { type: String, required: true },
    timeWindow: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);

// ==========================================
// AUTH ROUTES (MATCHES FRONTEND API ENDPOINTS)
// ==========================================

// 1. REGISTER / SIGNUP ROUTE
app.post(['/api/users/register', '/api/users/signup', '/api/register'], async (req, res) => {
  try {
    const { name, username, email, password, role, classOrSubject } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const derivedUsername = username ? username.trim() : cleanEmail.split('@')[0];

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: derivedUsername }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }

    const newUser = new User({
      name: name || 'Student',
      username: derivedUsername,
      email: cleanEmail,
      password: password,
      role: role || 'student',
      classOrSubject: classOrSubject || 'MCA',
    });

    await newUser.save();

    res.status(201).json({
      message: 'Account created successfully!',
      token: 'eduflow-token-' + newUser._id,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        classOrSubject: newUser.classOrSubject,
      },
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// 2. LOGIN ROUTE
app.post(['/api/users/login', '/api/login'], async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginInput = (identifier || email || username || '').trim().toLowerCase();

    if (!loginInput || !password) {
      return res.status(400).json({ message: 'Please enter email/username and password.' });
    }

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ email: loginInput }, { username: loginInput }],
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please check your credentials.' });
    }

    // Compare password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    res.json({
      message: 'Login successful!',
      token: 'eduflow-token-' + user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        classOrSubject: user.classOrSubject,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ==========================================
// ASSIGNMENT CRUD ROUTES
// ==========================================

// Get All Assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const filter = req.query.user ? { user: req.query.user } : {};
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments.' });
  }
});

// Create New Assignment
app.post('/api/assignments', async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    const saved = await newAssignment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error saving assignment.' });
  }
});

// Update Assignment
app.put('/api/assignments/:id', async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating assignment.' });
  }
});

// Delete Assignment
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting assignment.' });
  }
});

// ==========================================
// PEER RADAR ROUTES
// ==========================================

// Get All Active Sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching study sessions.' });
  }
});

// Create Study Session
app.post('/api/sessions', async (req, res) => {
  try {
    const newSession = new Session(req.body);
    const saved = await newSession.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error saving study session.' });
  }
});

// Terminate/Delete Session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting study session.' });
  }
});

// Health check test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'EduFlow Backend is running smoothly!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
