import express from 'express';
import Exam from '../models/Exam.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.userId }).sort({ date: 1 });
    return res.json(exams.map((e) => ({ ...e.toObject(), id: e._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching exams.' });
  }
});

// POST new exam
router.post('/', async (req, res) => {
  try {
    const { subject, date, time, location, notes, completed } = req.body;
    if (!subject || !date) {
      return res.status(400).json({ message: 'Subject and date are required.' });
    }

    const exam = new Exam({
      userId: req.userId,
      subject: subject.trim(),
      date,
      time: time || '',
      location: location ? location.trim() : '',
      notes: notes ? notes.trim() : '',
      completed: Boolean(completed),
    });

    await exam.save();
    return res.status(201).json({ ...exam.toObject(), id: exam._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating exam.' });
  }
});

// PUT update exam
router.put('/:id', async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!exam) return res.status(404).json({ message: 'Exam not found.' });
    return res.json({ ...exam.toObject(), id: exam._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating exam.' });
  }
});

// DELETE exam
router.delete('/:id', async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!exam) return res.status(404).json({ message: 'Exam not found.' });
    return res.json({ message: 'Exam deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting exam.' });
  }
});

export default router;
