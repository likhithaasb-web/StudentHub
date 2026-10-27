import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AttendanceSubject from '../models/AttendanceSubject.js';
import AttendanceRecord from '../models/AttendanceRecord.js';
import Task from '../models/Task.js';
import Timetable from '../models/Timetable.js';
import Exam from '../models/Exam.js';
import Note from '../models/Note.js';
import StudySession from '../models/StudySession.js';
import Resume from '../models/Resume.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'studenthub_super_secret_jwt_key_2026';
  return jwt.sign({ userId }, secret, { expiresIn: '30d' });
};

// 1. Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, collegeName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      collegeName: collegeName ? collegeName.trim() : '',
    });

    await user.save();
    const token = signToken(user._id);

    // Automatically seed core subjects: CN, MFEF, TRAINING, OT, API, ML
    const initialSubjects = [
      { name: 'CN', fullName: 'Computer Networks', color: '#DFD6AE' },
      { name: 'MFEF', fullName: 'Mathematical Foundations of Economics & Finance', color: '#67e8f9' },
      { name: 'TRAINING', fullName: 'Technical & Placement Training', color: '#34d399' },
      { name: 'OT', fullName: 'Optimization Techniques', color: '#f59e0b' },
      { name: 'API', fullName: 'API Development & Web Services', color: '#a78bfa' },
      { name: 'ML', fullName: 'Machine Learning', color: '#f87171' },
    ];

    await AttendanceSubject.insertMany(
      initialSubjects.map((s) => ({ ...s, userId: user._id }))
    );

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        targetAttendance: user.targetAttendance,
        dailyStudyGoalMinutes: user.dailyStudyGoalMinutes,
        theme: user.theme,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        targetAttendance: user.targetAttendance,
        dailyStudyGoalMinutes: user.dailyStudyGoalMinutes,
        theme: user.theme,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// 3. Get Current User Profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching user profile.' });
  }
});

// 4. Update Profile Settings
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const { name, collegeName, targetAttendance, dailyStudyGoalMinutes, theme } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (collegeName !== undefined) user.collegeName = collegeName.trim();
    if (targetAttendance) user.targetAttendance = targetAttendance;
    if (dailyStudyGoalMinutes) user.dailyStudyGoalMinutes = dailyStudyGoalMinutes;
    if (theme) user.theme = theme;

    await user.save();

    return res.json({
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        targetAttendance: user.targetAttendance,
        dailyStudyGoalMinutes: user.dailyStudyGoalMinutes,
        theme: user.theme,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating settings.' });
  }
});

export default router;
