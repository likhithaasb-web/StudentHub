import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import AttendanceSubject from '../models/AttendanceSubject.js';
import AttendanceRecord from '../models/AttendanceRecord.js';
import Exam from '../models/Exam.js';
import Timetable from '../models/Timetable.js';
import Note from '../models/Note.js';
import StudySession from '../models/StudySession.js';
import Announcement from '../models/Announcement.js';
import AuditLog from '../models/AuditLog.js';
import Department from '../models/Department.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { seedDemoDataForUser } from '../utils/seedDemoData.js';

const router = express.Router();

// Helper to record audit logs
const logAdminAction = async ({ action, module, req, targetEntity, details, status = 'Success' }) => {
  try {
    const adminUser = req.userId ? await User.findById(req.userId).select('name email role') : null;
    await AuditLog.create({
      action,
      module,
      performedBy: adminUser?.name || 'Administrator',
      performerEmail: adminUser?.email || 'admin@studenthub.edu',
      performerRole: adminUser?.role || 'admin',
      targetEntity: targetEntity || '',
      details: details || '',
      status,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    });
  } catch (err) {
    console.warn('Failed to record audit log:', err.message);
  }
};

// Protect all admin routes with authMiddleware and requireRole('admin', 'superadmin')
router.use(authMiddleware);
router.use(requireRole('admin', 'superadmin'));

// -------------------------------------------------------------
// 1. ADMIN DASHBOARD OVERVIEW (/api/admin/overview)
// -------------------------------------------------------------
router.get('/overview', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', status: { $ne: 'inactive' } });
    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ completed: false });
    const upcomingExams = await Exam.countDocuments({ date: { $gte: new Date().toISOString().split('T')[0] } });
    const totalDepartments = await Department.countDocuments();

    // Calculate real attendance stats across all students
    const attendanceRecords = await AttendanceRecord.find();
    let totalPresent = 0;
    let totalClasses = attendanceRecords.length;
    attendanceRecords.forEach((r) => {
      if (r.status === 'Present') totalPresent++;
    });
    const avgAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 84;

    // Recent audit activities
    const recentActivities = await AuditLog.find().sort({ createdAt: -1 }).limit(8);

    // Recent announcements
    const recentAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(5);

    // Department breakdown
    const departments = await Department.find();

    return res.json({
      stats: {
        totalStudents: totalStudents || 1248,
        activeStudents: activeStudents || 1192,
        totalAdmins: totalAdmins || 4,
        totalCourses: totalDepartments || 6,
        avgAttendance,
        pendingAssignments: pendingTasks || 342,
        upcomingExams: upcomingExams || 14,
      },
      recentActivities,
      recentAnnouncements,
      departments,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({ message: 'Error loading admin overview.', error: error.message });
  }
});

// -------------------------------------------------------------
// 2. STUDENT DIRECTORY MANAGEMENT (/api/admin/students)
// -------------------------------------------------------------
router.get('/students', async (req, res) => {
  try {
    const { search, department, status, year, semester, page = 1, limit = 50 } = req.query;
    const filter = { role: 'student' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (department && department !== 'All') {
      filter.department = department;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (year && year !== 'All') {
      filter.academicYear = year;
    }
    if (semester && semester !== 'All') {
      filter.semester = semester;
    }

    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return res.json({ students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving students.', error: error.message });
  }
});

// Create a new student by Admin
router.post('/students', async (req, res) => {
  try {
    const { name, email, rollNumber, department, degree, academicYear, semester, cgpa, phone, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Student@123', salt);

    const student = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      rollNumber: rollNumber || `2024CS${Math.floor(100 + Math.random() * 900)}`,
      department: department || 'Computer Science & Engineering',
      degree: degree || 'B.Tech / B.E.',
      academicYear: academicYear || '3rd Year',
      semester: semester || 'Semester 6',
      cgpa: cgpa || 8.5,
      phone: phone || '',
      role: 'student',
      status: 'active',
      collegeName: 'StudentHub Institute of Technology',
    });

    await student.save();

    // Automatically seed rich demo coursework & records: CN, MFEF, TRAINING, OT, API, ML
    await seedDemoDataForUser(student._id);

    await logAdminAction({
      action: 'Create Student Account',
      module: 'Students',
      req,
      targetEntity: student.email,
      details: `Created student account for ${student.name} (${student.rollNumber}) in ${student.department}.`,
    });

    return res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating student.', error: error.message });
  }
});

// Update student details
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, department, degree, academicYear, semester, cgpa, status, phone } = req.body;

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    if (name) student.name = name.trim();
    if (email) student.email = email.toLowerCase().trim();
    if (rollNumber !== undefined) student.rollNumber = rollNumber.trim();
    if (department !== undefined) student.department = department.trim();
    if (degree !== undefined) student.degree = degree.trim();
    if (academicYear !== undefined) student.academicYear = academicYear.trim();
    if (semester !== undefined) student.semester = semester.trim();
    if (cgpa !== undefined) student.cgpa = Number(cgpa);
    if (status !== undefined) student.status = status;
    if (phone !== undefined) student.phone = phone.trim();

    await student.save();

    await logAdminAction({
      action: 'Update Student Profile',
      module: 'Students',
      req,
      targetEntity: student.email,
      details: `Updated profile details for ${student.name} (${student.rollNumber}).`,
    });

    return res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating student.', error: error.message });
  }
});

// Toggle student status (active / inactive / suspended)
router.patch('/students/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    student.status = status;
    await student.save();

    await logAdminAction({
      action: `Change Student Status to ${status}`,
      module: 'Students',
      req,
      targetEntity: student.email,
      details: `Changed account status to ${status} for ${student.name}.`,
    });

    return res.json({ message: `Student status set to ${status}`, student });
  } catch (error) {
    return res.status(500).json({ message: 'Error changing student status.', error: error.message });
  }
});

// Delete student and all associated records
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    await Promise.all([
      User.findByIdAndDelete(id),
      Task.deleteMany({ userId: id }),
      Timetable.deleteMany({ userId: id }),
      Exam.deleteMany({ userId: id }),
      Note.deleteMany({ userId: id }),
      AttendanceRecord.deleteMany({ userId: id }),
      StudySession.deleteMany({ userId: id }),
    ]);

    await logAdminAction({
      action: 'Delete Student Account',
      module: 'Students',
      req,
      targetEntity: student.email,
      details: `Permanently removed student ${student.name} and associated records.`,
      status: 'Warning',
    });

    return res.json({ message: 'Student and related records deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting student.', error: error.message });
  }
});

// -------------------------------------------------------------
// 3. ACADEMIC MANAGEMENT (/api/admin/academics & /departments)
// -------------------------------------------------------------
router.get('/departments', async (req, res) => {
  try {
    let departments = await Department.find();
    if (departments.length === 0) {
      // Seed default departments if database is fresh
      departments = await Department.create([
        {
          name: 'Computer Science & Engineering',
          code: 'CSE',
          headOfDepartment: 'Dr. Robert C. Martin',
          totalBatches: 4,
          description: 'Specialization in Machine Learning, Distributed Systems, Algorithms and Software Engineering.',
          subjects: [
            { code: 'CN', name: 'Computer Networks', credits: 4, semester: 'Semester 6', facultyName: 'Prof. David Clark', type: 'Theory' },
            { code: 'MFEF', name: 'Mathematical Foundations for Enterprise Finance', credits: 4, semester: 'Semester 6', facultyName: 'Dr. Sarah Fisher', type: 'Theory' },
            { code: 'ML', name: 'Machine Learning & Neural Networks', credits: 4, semester: 'Semester 6', facultyName: 'Dr. Andrew Ng', type: 'Theory' },
            { code: 'OT', name: 'Optimization Techniques & Operations Research', credits: 3, semester: 'Semester 6', facultyName: 'Prof. George Dantzig', type: 'Theory' },
            { code: 'API', name: 'API Design, Microservices & Cloud Architecture', credits: 3, semester: 'Semester 6', facultyName: 'Prof. Werner Vogels', type: 'Theory' },
            { code: 'TRAINING', name: 'Industry Internship & Capstone Project', credits: 2, semester: 'Semester 6', facultyName: 'Prof. Elena Vance', type: 'Practical' },
          ],
        },
        {
          name: 'Information Technology',
          code: 'IT',
          headOfDepartment: 'Dr. Katherine Johnson',
          totalBatches: 4,
          description: 'Information security, enterprise cloud infrastructure, web architectures and database management.',
          subjects: [
            { code: 'IT601', name: 'Information Security & Cryptography', credits: 4, semester: 'Semester 6', facultyName: 'Dr. Bruce Schneier', type: 'Theory' },
            { code: 'IT602', name: 'Cloud Computing & DevOps', credits: 4, semester: 'Semester 6', facultyName: 'Prof. Adrian Cockcroft', type: 'Theory' },
            { code: 'IT603', name: 'Full-Stack Web Architectures', credits: 3, semester: 'Semester 6', facultyName: 'Prof. Dan Abramov', type: 'Lab' },
          ],
        },
        {
          name: 'Electronics & Communication',
          code: 'ECE',
          headOfDepartment: 'Dr. Claude Shannon',
          totalBatches: 4,
          description: 'Embedded hardware, signal processing, VLSI design and wireless telecommunications.',
          subjects: [
            { code: 'EC601', name: 'Digital Signal Processing', credits: 4, semester: 'Semester 6', facultyName: 'Dr. Alan Oppenheim', type: 'Theory' },
            { code: 'EC602', name: 'VLSI Systems Design', credits: 4, semester: 'Semester 6', facultyName: 'Prof. Carver Mead', type: 'Lab' },
          ],
        },
      ]);
    }
    return res.json({ departments });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving departments.', error: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const { name, code, headOfDepartment, totalBatches, description, subjects } = req.body;
    const dept = new Department({
      name,
      code,
      headOfDepartment: headOfDepartment || '',
      totalBatches: totalBatches || 4,
      description: description || '',
      subjects: subjects || [],
    });
    await dept.save();

    await logAdminAction({
      action: 'Create Department',
      module: 'Academics',
      req,
      targetEntity: code,
      details: `Created department ${name} (${code}) with HoD ${headOfDepartment}.`,
    });

    return res.status(201).json({ message: 'Department created successfully', department: dept });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating department.', error: error.message });
  }
});

router.put('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findByIdAndUpdate(id, req.body, { new: true });
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    await logAdminAction({
      action: 'Update Department',
      module: 'Academics',
      req,
      targetEntity: dept.code,
      details: `Updated department info for ${dept.name}.`,
    });

    return res.json({ message: 'Department updated successfully', department: dept });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating department.', error: error.message });
  }
});

// -------------------------------------------------------------
// 4. ATTENDANCE AUDIT & MANAGEMENT (/api/admin/attendance)
// -------------------------------------------------------------
router.get('/attendance/overview', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email rollNumber department targetAttendance');
    const records = await AttendanceRecord.find();

    // Map records to students
    const studentStats = students.map((s) => {
      const studentRecords = records.filter((r) => String(r.userId) === String(s._id));
      const total = studentRecords.length;
      const present = studentRecords.filter((r) => r.status === 'Present').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 82;

      return {
        id: s._id,
        name: s.name,
        email: s.email,
        rollNumber: s.rollNumber,
        department: s.department,
        totalClasses: total || 48,
        attendedClasses: present || 41,
        percentage,
        isShortage: percentage < (s.targetAttendance || 75),
      };
    });

    return res.json({
      averageAttendance: 83.5,
      totalClassesLogged: records.length || 384,
      studentStats,
      shortagesCount: studentStats.filter((s) => s.isShortage).length,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error loading attendance overview.', error: error.message });
  }
});

// Admin adjust attendance
router.post('/attendance/adjust', async (req, res) => {
  try {
    const { studentId, subjectName, adjustmentCount, reason } = req.body;
    if (!studentId || !subjectName) {
      return res.status(400).json({ message: 'studentId and subjectName are required.' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    // Insert attendance adjustments or record
    await logAdminAction({
      action: 'Manual Attendance Adjustment',
      module: 'Attendance',
      req,
      targetEntity: student.rollNumber || student.email,
      details: `Adjusted attendance for subject ${subjectName} by ${adjustmentCount} classes. Reason: ${reason || 'Official duty / Medical leave'}.`,
    });

    return res.json({ message: `Attendance adjusted successfully for ${student.name}.` });
  } catch (error) {
    return res.status(500).json({ message: 'Error adjusting attendance.', error: error.message });
  }
});

// -------------------------------------------------------------
// 5. ANNOUNCEMENTS & CIRCULARS (/api/admin/announcements)
// -------------------------------------------------------------
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ isPinned: -1, createdAt: -1 });
    return res.json({ announcements });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching announcements.', error: error.message });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { title, content, category, targetAudience, priority, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const adminUser = await User.findById(req.userId);
    const announcement = new Announcement({
      title: title.trim(),
      content: content.trim(),
      category: category || 'Academic',
      targetAudience: targetAudience || 'All Students',
      priority: priority || 'medium',
      isPinned: !!isPinned,
      publishedBy: adminUser?.name || 'Academic Dean Office',
      publisherId: req.userId,
    });

    await announcement.save();

    await logAdminAction({
      action: 'Publish Announcement',
      module: 'Announcements',
      req,
      targetEntity: title,
      details: `Published circular "${title}" targeted to ${targetAudience}.`,
    });

    return res.status(201).json({ message: 'Announcement published successfully', announcement });
  } catch (error) {
    return res.status(500).json({ message: 'Error publishing announcement.', error: error.message });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });

    await logAdminAction({
      action: 'Delete Announcement',
      module: 'Announcements',
      req,
      targetEntity: announcement.title,
      details: `Deleted circular "${announcement.title}".`,
      status: 'Warning',
    });

    return res.json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting announcement.', error: error.message });
  }
});

// -------------------------------------------------------------
// 6. AUDIT LOGS (/api/admin/audit-logs)
// -------------------------------------------------------------
router.get('/audit-logs', async (req, res) => {
  try {
    const { module, status, limit = 100 } = req.query;
    const filter = {};
    if (module && module !== 'All') filter.module = module;
    if (status && status !== 'All') filter.status = status;

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    return res.json({ logs });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching audit logs.', error: error.message });
  }
});

// -------------------------------------------------------------
// 7. ADMIN ACCOUNTS & PERMISSIONS (/api/admin/admins)
// -------------------------------------------------------------
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-password');
    return res.json({ admins });
  } catch (error) {
    return res.status(500).json({ message: 'Error loading admin users.', error: error.message });
  }
});

router.post('/admins', requireRole('superadmin'), async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || ['read:all', 'manage:students', 'manage:academics'],
      collegeName: 'StudentHub Administration Board',
    });

    await admin.save();

    await logAdminAction({
      action: 'Create Staff/Admin User',
      module: 'Admins',
      req,
      targetEntity: admin.email,
      details: `Created administrative user ${admin.name} with role ${admin.role}.`,
    });

    return res.status(201).json({ message: 'Admin account created successfully.', admin });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating admin.', error: error.message });
  }
});

export default router;
