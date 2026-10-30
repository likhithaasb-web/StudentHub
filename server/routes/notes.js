import express from 'express';
import Note from '../models/Note.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET public note by ID (accessible without authentication for peer sharing)
router.get('/public/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let note = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      note = await Note.findById(id);
    }
    if (!note) {
      note = await Note.findOne({ id: id });
    }
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    return res.json({ ...note.toObject(), id: note._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching public note' });
  }
});

router.use(authMiddleware);

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ pinned: -1, updatedAt: -1 });
    return res.json(notes.map((n) => ({ ...n.toObject(), id: n._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notes.' });
  }
});

// POST new note
router.post('/', async (req, res) => {
  try {
    const { title, subject, content, tags, pinned, attachments } = req.body;
    if (!title || !subject) {
      return res.status(400).json({ message: 'Title and subject are required.' });
    }

    const note = new Note({
      userId: req.userId,
      title: title.trim(),
      subject: subject.trim(),
      content: content || '',
      tags: Array.isArray(tags) ? tags : [],
      pinned: Boolean(pinned),
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    await note.save();
    return res.status(201).json({ ...note.toObject(), id: note._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating note.' });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    return res.json({ ...note.toObject(), id: note._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating note.' });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    return res.json({ message: 'Note deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting note.' });
  }
});

export default router;
