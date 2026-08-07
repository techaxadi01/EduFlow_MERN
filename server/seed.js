const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS SRV lookup failure
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas for seeding...'))
  .catch((err) => console.error('Connection error:', err));

// Schemas — mirrors server.js exactly
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

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    username: { type: String, default: 'anonymous' },
  },
  { timestamps: true }
);
const Assignment = mongoose.model('Assignment', assignmentSchema);

const sessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    subject: { type: String, required: true },
    locationName: { type: String, required: true },
    timeWindow: { type: String, required: true },
    startTime: { type: String, default: '00:00' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);
const Session = mongoose.model('Session', sessionSchema);

// ==========================================
// USERS
// Note: "aditya" and "techaxadi" share the display name "Aditya Kumar" on
// purpose — same for "adi" and "adi1" sharing "Adi". This intentionally
// tests that assignments/sessions are matched by the unique `username`
// field and don't leak between accounts that happen to share a display name.
// ==========================================
const users = [
  { username: 'adi', email: 'adi@eduflow.com', password: '000', role: 'admin', name: 'Adi' },
  { username: 'admin', email: 'admin@eduflow.com', password: '123', role: 'admin', name: 'Admin' },
  { username: 'dr_vijay', email: 'vijay@christ.edu', password: 'password', role: 'teacher', name: 'Vijay', classOrSubject: 'FSD' },
  { username: 'dr_tejal', email: 'tejal@christ.edu', password: 'password', role: 'teacher', name: 'Tejal', classOrSubject: 'COD' },
  { username: 'aditya', email: 'aditya@student.edu', password: 'password', role: 'student', name: 'Aditya Kumar', classOrSubject: 'MCA' },
  { username: 'techaxadi', email: 'adikr@a.in', password: 'asdf', role: 'student', name: 'Aditya Kumar', classOrSubject: 'MCA' },
  { username: 'aishraj', email: 'aishraj@student.edu', password: 'password', role: 'student', name: 'Aishraj Sahu', classOrSubject: 'BSC DEF' },
  { username: 'aaa', email: 'aa@aa.in', password: '0000', role: 'student', name: 'adityak', classOrSubject: 'mca' },
  { username: 'test001', email: 't@t.in', password: '0000', role: 'student', name: 'Test', classOrSubject: 'mca' },
  { username: 'adi1', email: 'a@student.edu', password: '0000', role: 'student', name: 'Adi', classOrSubject: 'mca' },
];

// ==========================================
// ASSIGNMENTS — every user has at least one, referenced by username
// ==========================================
const assignments = [
  { username: 'aditya', title: 'REST API Integration & JWT Auth', subject: 'Full Stack Development (FSD)', dueDate: '2026-08-10', status: 'Pending' },
  { username: 'aditya', title: 'Subnetting and TCP/IP Packet Analyzer', subject: 'Computer Networks', dueDate: '2026-08-15', status: 'Pending' },
  { username: 'techaxadi', title: 'Process Scheduling Algorithms Simulation', subject: 'Operating Systems', dueDate: '2026-08-08', status: 'Completed' },
  { username: 'aaa', title: 'B-Tree and B+ Tree Indexing Paper', subject: 'Advanced Database Management Systems', dueDate: '2026-08-12', status: 'Completed' },
  { username: 'aishraj', title: 'Asymmetric Cryptography Implementation', subject: 'Cyber Security & Cryptography', dueDate: '2026-08-18', status: 'Pending' },
  { username: 'adi', title: 'Lab 7', subject: 'FSD', dueDate: '2026-08-08', status: 'Pending' },
  { username: 'admin', title: 'Review Course Syllabus', subject: 'General Studies', dueDate: '2026-08-22', status: 'Pending' },
  { username: 'dr_vijay', title: 'Explore EduFlow: Set Up Your Profile', subject: 'Orientation', dueDate: '2026-08-20', status: 'Pending' },
  { username: 'dr_tejal', title: 'Review Course Syllabus', subject: 'General Studies', dueDate: '2026-08-22', status: 'Pending' },
  { username: 'test001', title: 'Submit Introductory Assignment', subject: 'Orientation', dueDate: '2026-08-25', status: 'Pending' },
  { username: 'adi1', title: 'Complete Onboarding Checklist', subject: 'Orientation', dueDate: '2026-08-24', status: 'Pending' },
];

// ==========================================
// SESSIONS — every user has at least one. `name` is the display name shown
// to peers; `username` is the unique owner reference; `startTime` (24-hour
// "HH:MM") drives the "sort from now" ordering on the Peer Radar page.
// A few sample "peer" sessions (Kevin/Sneha/Rahul) are included purely to
// give the Campus Sessions grid some variety — they use synthetic usernames
// since they aren't tied to a real login account.
// ==========================================
const sessions = [
  // adi — 3 sessions
  { username: 'adi', name: 'Adi', subject: 'Peer Radar Orientation', locationName: 'Central Library Block A', timeWindow: '02:00 PM - 03:00 PM', startTime: '14:00', lat: 12.9352, lng: 77.6146 },
  { username: 'adi', name: 'Adi', subject: 'System Design Deep Dive', locationName: 'Christ University Library Annex', timeWindow: '09:00 AM - 11:00 AM', startTime: '09:00', lat: 12.9346, lng: 77.6068 },
  { username: 'adi', name: 'Adi', subject: 'MongoDB Aggregation Pipelines', locationName: 'Cafe Coffee Day, Hosur Road', timeWindow: '05:00 PM - 06:30 PM', startTime: '17:00', lat: 12.9279, lng: 77.6271 },

  // dr_vijay — 3 sessions
  { username: 'dr_vijay', name: 'Vijay', subject: 'Getting Started with EduFlow', locationName: 'Christ University Central Campus', timeWindow: '10:00 AM - 11:00 AM', startTime: '10:00', lat: 12.9344, lng: 77.606 },
  { username: 'dr_vijay', name: 'Vijay', subject: 'Full Stack Dev - Code Review Session', locationName: 'Faculty Block, Room 204', timeWindow: '11:00 AM - 12:30 PM', startTime: '11:00', lat: 12.9351, lng: 77.6055 },
  { username: 'dr_vijay', name: 'Vijay', subject: 'React Hooks & State Management', locationName: 'Christ University Auditorium Foyer', timeWindow: '02:00 PM - 03:30 PM', startTime: '14:00', lat: 12.9348, lng: 77.6062 },

  // aditya (Aditya Kumar #1) — 3 sessions
  { username: 'aditya', name: 'Aditya Kumar', subject: 'Getting Started with EduFlow', locationName: 'Christ University Central Campus', timeWindow: '10:00 AM - 11:00 AM', startTime: '10:00', lat: 12.9344, lng: 77.606 },
  { username: 'aditya', name: 'Aditya Kumar', subject: 'Operating Systems - Deadlock Handling', locationName: 'MCA Block Study Room', timeWindow: '10:00 AM - 12:00 PM', startTime: '10:00', lat: 12.936, lng: 77.607 },
  { username: 'aditya', name: 'Aditya Kumar', subject: 'Cyber Security - Cryptography Basics', locationName: 'Central Library Block A', timeWindow: '03:00 PM - 04:30 PM', startTime: '15:00', lat: 12.9352, lng: 77.6146 },

  // techaxadi (Aditya Kumar #2 — different account, same display name) — 1 session
  { username: 'techaxadi', name: 'Aditya Kumar', subject: 'Database Normalization Practice', locationName: 'Central Library Block A', timeWindow: '01:00 PM - 02:30 PM', startTime: '13:00', lat: 12.9352, lng: 77.6146 },

  // remaining users — 1 session each
  { username: 'aaa', name: 'adityak', subject: 'Getting Started with EduFlow', locationName: 'Christ University Central Campus', timeWindow: '10:00 AM - 11:00 AM', startTime: '10:00', lat: 12.9344, lng: 77.606 },
  { username: 'aishraj', name: 'Aishraj Sahu', subject: 'Study Group Kickoff', locationName: 'Kendriya Vidyalaya No.2, Jallahali', timeWindow: '04:00 PM - 05:00 PM', startTime: '16:00', lat: 13.0418, lng: 77.5385 },
  { username: 'admin', name: 'Admin', subject: 'Peer Radar Orientation', locationName: 'Central Library Block A', timeWindow: '02:00 PM - 03:00 PM', startTime: '14:00', lat: 12.9352, lng: 77.6146 },
  { username: 'dr_tejal', name: 'Tejal', subject: 'Peer Radar Orientation', locationName: 'Central Library Block A', timeWindow: '02:00 PM - 03:00 PM', startTime: '14:00', lat: 12.9352, lng: 77.6146 },
  { username: 'test001', name: 'Test', subject: 'FSD', locationName: 'Home', timeWindow: '16:40 - 20:00', startTime: '16:40', lat: 13.06931237936485, lng: 77.5436410259712 },
  { username: 'adi1', name: 'Adi', subject: 'Getting Started with EduFlow', locationName: 'Christ University Central Campus', timeWindow: '10:00 AM - 11:00 AM', startTime: '10:00', lat: 12.9344, lng: 77.606 },

  // sample peers without login accounts, for a richer Campus Sessions grid
  { username: 'sample_rahul_sharma', name: 'Rahul Sharma', subject: 'Full Stack Dev - API Routes', locationName: 'Christ University Central Campus', timeWindow: '10:00 AM - 01:00 PM', startTime: '10:00', lat: 12.9344, lng: 77.606 },
  { username: 'sample_sneha_patel', name: 'Sneha Patel', subject: 'Advanced DB - B-Trees Practice', locationName: 'Kendriya Vidyalaya No.2, Jallahali', timeWindow: '03:30 PM - 05:00 PM', startTime: '15:30', lat: 13.0418, lng: 77.5385 },
  { username: 'sample_kevin_alvares', name: 'Kevin Alvares', subject: 'C Language Pointer Arithmetic', locationName: "St. Xavier's Lab 3 Mumbai", timeWindow: '11:15 AM - 02:00 PM', startTime: '11:15', lat: 18.9438, lng: 72.8317 },
];

// Full reset + populate. Intended to run ONCE against an empty database
// (after you've dropped the old collections), not as a routine top-up.
const seedFullDatabase = async () => {
  try {
    await User.deleteMany();
    await Assignment.deleteMany();
    await Session.deleteMany();

    await User.insertMany(users);
    await Assignment.insertMany(assignments);
    await Session.insertMany(sessions);

    console.log(`Seed complete: ${users.length} users, ${assignments.length} assignments, ${sessions.length} sessions.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedFullDatabase();
