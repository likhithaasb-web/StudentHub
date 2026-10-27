import express from 'express';
import Timetable from '../models/Timetable.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET all classes
router.get('/', async (req, res) => {
  try {
    const list = await Timetable.find({ userId: req.userId }).sort({ startTime: 1 });
    return res.json(list.map((c) => ({ ...c.toObject(), id: c._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching timetable.' });
  }
});

// POST class session
router.post('/', async (req, res) => {
  try {
    const { day, subject, classroom, startTime, endTime, color } = req.body;
    if (!day || !subject || !startTime || !endTime) {
      return res.status(400).json({ message: 'Day, subject, startTime, and endTime are required.' });
    }

    const session = new Timetable({
      userId: req.userId,
      day,
      subject: subject.trim(),
      classroom: classroom ? classroom.trim() : '',
      startTime,
      endTime,
      color: color || '#DFD6AE',
    });

    await session.save();
    return res.status(201).json({ ...session.toObject(), id: session._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating class session.' });
  }
});

// PUT update class session
router.put('/:id', async (req, res) => {
  try {
    const session = await Timetable.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Class session not found.' });
    return res.json({ ...session.toObject(), id: session._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating class session.' });
  }
});

// DELETE class session
router.delete('/:id', async (req, res) => {
  try {
    const session = await Timetable.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!session) return res.status(404).json({ message: 'Class session not found.' });
    return res.json({ message: 'Class session deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting class session.' });
  }
});

export default router;
