import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import attendanceRoutes from './routes/attendance.js';
import timetableRoutes from './routes/timetable.js';
import examRoutes from './routes/exams.js';
import noteRoutes from './routes/notes.js';
import studySessionRoutes from './routes/studySessions.js';
import resumeRoutes from './routes/resumes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Initialize Database connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/resumes', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    service: 'StudentHub API',
    database: isDbConnected ? 'connected' : 'disconnected / offline',
    timestamp: new Date().toISOString(),
  });
});

// Root check
app.get('/', (req, res) => {
  res.send('StudentHub API Server is running. Visit /api/health for system status.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 StudentHub Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
