import express from 'express';
import Resume from '../models/Resume.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate a clean random 9-character share slug
const generateShareId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// 1. PUBLIC ROUTE: View resume by shareId (No login required)
router.get('/public/:shareId', async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareId: req.params.shareId });
    if (!resume) {
      return res.status(404).json({ message: 'Shared resume not found or link has expired.' });
    }
    return res.json({ resume });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving shared resume.' });
  }
});

// All following routes require authentication
router.use(authMiddleware);

// 2. GET all resumes for user
router.get('/', async (req, res) => {
  try {
    const list = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    return res.json(list.map((r) => ({ ...r.toObject(), id: r._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching resumes.' });
  }
});

// 3. POST new resume
router.post('/', async (req, res) => {
  try {
    const resumeData = req.body;
    const shareId = resumeData.shareId || generateShareId();

    const resume = new Resume({
      ...resumeData,
      userId: req.userId,
      shareId,
    });

    await resume.save();
    return res.status(201).json({ ...resume.toObject(), id: resume._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving resume.', error: error.message });
  }
});

// 4. PUT update resume
router.put('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    return res.json({ ...resume.toObject(), id: resume._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating resume.' });
  }
});

// 5. DELETE resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    return res.json({ message: 'Resume deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting resume.' });
  }
});

// 6. Duplicate resume
router.post('/:id/duplicate', async (req, res) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!original) return res.status(404).json({ message: 'Resume not found.' });

    const copyObj = original.toObject();
    delete copyObj._id;
    delete copyObj.createdAt;
    delete copyObj.updatedAt;

    copyObj.title = `${original.title} (Copy)`;
    copyObj.shareId = generateShareId();

    const duplicate = new Resume(copyObj);
    await duplicate.save();
    return res.status(201).json({ ...duplicate.toObject(), id: duplicate._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error duplicating resume.' });
  }
});

export default router;
