import express from 'express';
import StudySession from '../models/StudySession.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET all study sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.userId }).sort({ date: -1 });
    return res.json(sessions.map((s) => ({ ...s.toObject(), id: s._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching study sessions.' });
  }
});

// POST new study session
router.post('/', async (req, res) => {
  try {
    const { subject, date, startTime, durationMinutes, notes } = req.body;
    if (!subject || !durationMinutes) {
      return res.status(400).json({ message: 'Subject and duration are required.' });
    }

    const session = new StudySession({
      userId: req.userId,
      subject: subject.trim(),
      date: date || new Date().toISOString().split('T')[0],
      startTime: startTime || '12:00',
      durationMinutes: Math.max(1, parseInt(durationMinutes, 10) || 25),
      notes: notes ? notes.trim() : '',
    });

    await session.save();
    return res.status(201).json({ ...session.toObject(), id: session._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving study session.' });
  }
});

// DELETE study session
router.delete('/:id', async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!session) return res.status(404).json({ message: 'Study session not found.' });
    return res.json({ message: 'Study session deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting study session.' });
  }
});

export default router;
