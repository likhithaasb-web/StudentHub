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
import { seedDemoDataForUser } from '../utils/seedDemoData.js';

const router = express.Router();

const signToken = (userId, role = 'student') => {
  const secret = process.env.JWT_SECRET || 'studenthub_super_secret_jwt_key_2026';
  return jwt.sign({ userId, role }, secret, { expiresIn: '30d' });
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
    const token = signToken(user._id, user.role || 'student');

    // Automatically seed rich demo coursework & records: CN, MFEF, TRAINING, OT, API, ML
    await seedDemoDataForUser(user._id);

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
        role: user.role || 'student',
        status: user.status || 'active',
        rollNumber: user.rollNumber || '',
        department: user.department || 'Computer Science & Engineering',
        degree: user.degree || 'B.Tech / B.E.',
        academicYear: user.academicYear || '3rd Year',
        semester: user.semester || 'Semester 6',
        cgpa: user.cgpa || 8.75,
        permissions: user.permissions || [],
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

    const token = signToken(user._id, user.role || 'student');

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
        role: user.role || 'student',
        status: user.status || 'active',
        rollNumber: user.rollNumber || '',
        department: user.department || 'Computer Science & Engineering',
        degree: user.degree || 'B.Tech / B.E.',
        academicYear: user.academicYear || '3rd Year',
        semester: user.semester || 'Semester 6',
        cgpa: user.cgpa || 8.75,
        permissions: user.permissions || [],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// Google Authentication
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required from Google.' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      user = new User({
        name: name || 'Google User',
        email: email.toLowerCase().trim(),
        password: await bcrypt.hash(Math.random().toString(36), 10),
        collegeName: 'Verified Google Student',
      });
      await user.save();
      await seedDemoDataForUser(user._id);
    } else {
      // If user exists but has 0 tasks or empty schedule, seed full demo coursework
      const taskCount = await Task.countDocuments({ userId: user._id });
      if (taskCount === 0) {
        await seedDemoDataForUser(user._id);
      }
    }

    const token = signToken(user._id, user.role || 'student');
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        targetAttendance: user.targetAttendance,
        dailyStudyGoalMinutes: user.dailyStudyGoalMinutes,
        theme: user.theme,
        role: user.role || 'student',
        status: user.status || 'active',
        rollNumber: user.rollNumber || '',
        department: user.department || 'Computer Science & Engineering',
        degree: user.degree || 'B.Tech / B.E.',
        academicYear: user.academicYear || '3rd Year',
        semester: user.semester || 'Semester 6',
        cgpa: user.cgpa || 8.75,
        permissions: user.permissions || [],
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ message: 'Server error during Google login.' });
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
    const {
      name,
      collegeName,
      targetAttendance,
      dailyStudyGoalMinutes,
      theme,
      rollNumber,
      department,
      degree,
      academicYear,
      semester,
      phone,
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (collegeName !== undefined) user.collegeName = collegeName.trim();
    if (targetAttendance) user.targetAttendance = targetAttendance;
    if (dailyStudyGoalMinutes) user.dailyStudyGoalMinutes = dailyStudyGoalMinutes;
    if (theme) user.theme = theme;
    if (rollNumber !== undefined) user.rollNumber = rollNumber.trim();
    if (department !== undefined) user.department = department.trim();
    if (degree !== undefined) user.degree = degree.trim();
    if (academicYear !== undefined) user.academicYear = academicYear.trim();
    if (semester !== undefined) user.semester = semester.trim();
    if (phone !== undefined) user.phone = phone.trim();

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
        role: user.role || 'student',
        status: user.status || 'active',
        rollNumber: user.rollNumber || '',
        department: user.department || 'Computer Science & Engineering',
        degree: user.degree || 'B.Tech / B.E.',
        academicYear: user.academicYear || '3rd Year',
        semester: user.semester || 'Semester 6',
        cgpa: user.cgpa || 8.75,
        phone: user.phone || '',
        permissions: user.permissions || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating settings.' });
  }
});

// 5. Seed Demo Data Endpoint (can be called by any authenticated student)
router.post('/seed-demo', authMiddleware, async (req, res) => {
  try {
    await seedDemoDataForUser(req.userId);
    return res.json({ message: 'Demo coursework and timetable seeded successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error seeding demo data.', error: error.message });
  }
});

// 6. Clear all user coursework records (tasks, timetable, exams, notes, attendance records, study sessions)
router.post('/clear-data', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    await Promise.all([
      Task.deleteMany({ userId }),
      Timetable.deleteMany({ userId }),
      Exam.deleteMany({ userId }),
      Note.deleteMany({ userId }),
      AttendanceRecord.deleteMany({ userId }),
      StudySession.deleteMany({ userId }),
    ]);
    return res.json({ message: 'All user coursework data cleared successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error clearing user data.', error: error.message });
  }
});

// Change Password Endpoint
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error updating password.', error: error.message });
  }
});

export default router;
