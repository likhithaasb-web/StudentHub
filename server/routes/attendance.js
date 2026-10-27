import express from 'express';
import AttendanceSubject from '../models/AttendanceSubject.js';
import AttendanceRecord from '../models/AttendanceRecord.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// 1. Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await AttendanceSubject.find({ userId: req.userId }).sort({ name: 1 });
    return res.json(subjects.map((s) => ({ ...s.toObject(), id: s._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subjects.' });
  }
});

// 2. Add subject
router.post('/subjects', async (req, res) => {
  try {
    const { name, fullName, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Subject name is required.' });

    const cleanName = name.trim().toUpperCase();
    const existing = await AttendanceSubject.findOne({ userId: req.userId, name: cleanName });
    if (existing) {
      return res.status(400).json({ message: `Subject "${cleanName}" already exists.` });
    }

    const subject = new AttendanceSubject({
      userId: req.userId,
      name: cleanName,
      fullName: fullName ? fullName.trim() : cleanName,
      color: color || '#DFD6AE',
    });

    await subject.save();
    return res.status(201).json({ ...subject.toObject(), id: subject._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating subject.' });
  }
});

// 3. Update subject
router.put('/subjects/:id', async (req, res) => {
  try {
    const { name, fullName, color } = req.body;
    const cleanName = name ? name.trim().toUpperCase() : undefined;

    const oldSubject = await AttendanceSubject.findOne({ _id: req.params.id, userId: req.userId });
    if (!oldSubject) return res.status(404).json({ message: 'Subject not found.' });

    const oldName = oldSubject.name;

    oldSubject.name = cleanName || oldSubject.name;
    if (fullName !== undefined) oldSubject.fullName = fullName.trim();
    if (color) oldSubject.color = color;

    await oldSubject.save();

    // Cascade name update to records if name changed
    if (cleanName && cleanName !== oldName) {
      await AttendanceRecord.updateMany(
        { userId: req.userId, subject: oldName },
        { $set: { subject: cleanName } }
      );
    }

    return res.json({ ...oldSubject.toObject(), id: oldSubject._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating subject.' });
  }
});

// 4. Delete subject and its associated records
router.delete('/subjects/:id', async (req, res) => {
  try {
    const subject = await AttendanceSubject.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    await AttendanceRecord.deleteMany({ userId: req.userId, subject: subject.name });
    return res.json({ message: 'Subject and records deleted', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting subject.' });
  }
});

// 5. Get all attendance records
router.get('/records', async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 });
    return res.json(records.map((r) => ({ ...r.toObject(), id: r._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching attendance records.' });
  }
});

// 6. Record class attendance
router.post('/records', async (req, res) => {
  try {
    const { subject, date, status, notes } = req.body;
    if (!subject || !date || !status) {
      return res.status(400).json({ message: 'Subject, date, and status are required.' });
    }

    const record = new AttendanceRecord({
      userId: req.userId,
      subject: subject.trim(),
      date,
      status: status === 'Absent' ? 'Absent' : 'Present',
      notes: notes ? notes.trim() : '',
    });

    await record.save();
    return res.status(201).json({ ...record.toObject(), id: record._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving attendance record.' });
  }
});

// 7. Update class attendance record (or toggle status)
router.put('/records/:id', async (req, res) => {
  try {
    const record = await AttendanceRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    return res.json({ ...record.toObject(), id: record._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating record.' });
  }
});

// 8. Delete class attendance record
router.delete('/records/:id', async (req, res) => {
  try {
    const record = await AttendanceRecord.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    return res.json({ message: 'Record deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting record.' });
  }
});

export default router;
