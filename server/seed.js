const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS SRV lookup failure
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB Atlas for seeding...'))
  .catch((err) => console.error(' Connection error:', err));

// Schemas
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Session = mongoose.model('Session', new mongoose.Schema({}, { strict: false }));
const Assignment = mongoose.model('Assignment', new mongoose.Schema({}, { strict: false }));

// Mock Data
const users = [
  { username: "adi", email: "adi@eduflow.com", password: "000", role: "admin", name: "Adi" },
  { username: "admin", email: "admin@eduflow.com", password: "123", role: "admin", name: "Admin" },
  { username: "dr_vijay", email: "vijay@christ.edu", password: "password", role: "teacher", name: "Vijay", classOrSubject: "FSD" },
  { username: "dr_tejal", email: "tejal@christ.edu", password: "password", role: "teacher", name: "Tejal", classOrSubject: "COD" },
  { username: "aditya", email: "aditya@student.edu", password: "password", role: "student", name: "Aditya Kumar", classOrSubject: "MCA" },
  { username: "aishraj", email: "aishraj@student.edu", password: "password", role: "student", name: "Aishraj Sahu", classOrSubject: "BSC DEF" },
  { username: "techaxadi", email: "adikr@a.in", password: "asdf", role: "student", name: "Aditya Kumar", classOrSubject: "MCA" },
  { username: "aaa", email: "aa@aa.in", password: "0000", role: "student", name: "adityak", classOrSubject: "mca" }
];

const sessions = [
  { name: "Rahul Sharma", subject: "Full Stack Dev - API Routes", locationName: "Christ University Central Campus", timeWindow: "10:00 AM - 01:00 PM", lat: 12.9344, lng: 77.606 },
  { name: "Sneha Patel", subject: "Advanced DB - B-Trees Practice", locationName: "Kendriya Vidyalaya No.2, Jallahali", timeWindow: "03:30 PM - 05:00 PM", lat: 13.0418, lng: 77.5385 },
  { name: "Kevin Alvares", subject: "C Language Pointer Arithmetic", locationName: "St. Xavier's Lab 3 Mumbai", timeWindow: "11:15 AM - 02:00 PM", lat: 18.9438, lng: 72.8317 }
];

const assignments = [
  { title: "REST API Integration & JWT Auth", subject: "Full Stack Development (FSD)", dueDate: "2026-08-10", status: "Pending", user: "Aditya Kumar" },
  { title: "B-Tree and B+ Tree Indexing Paper", subject: "Advanced Database Management Systems", dueDate: "2026-08-12", status: "Completed", user: "adityak" },
  { title: "Subnetting and TCP/IP Packet Analyzer", subject: "Computer Networks", dueDate: "2026-08-15", status: "Pending", user: "Aditya Kumar" },
  { title: "Asymmetric Cryptography Implementation", subject: "Cyber Security & Cryptography", dueDate: "2026-08-18", status: "Pending", user: "Aishraj Sahu" },
  { title: "Process Scheduling Algorithms Simulation", subject: "Operating Systems", dueDate: "2026-08-08", status: "Completed", user: "Aditya Kumar" }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Session.deleteMany();
    await Assignment.deleteMany();

    await User.insertMany(users);
    await Session.insertMany(sessions);
    await Assignment.insertMany(assignments);

    console.log(' Mock Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(' Seeding Failed:', error);
    process.exit(1);
  }
};

importData();
