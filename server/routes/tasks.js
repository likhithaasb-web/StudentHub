import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET all tasks for user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ dueDate: 1 });
    return res.json(tasks.map((t) => ({ ...t.toObject(), id: t._id })));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching tasks.' });
  }
});

// POST new task
router.post('/', async (req, res) => {
  try {
    const { title, description, subject, dueDate, priority, status } = req.body;
    if (!title || !subject || !dueDate) {
      return res.status(400).json({ message: 'Title, subject, and due date are required.' });
    }

    const task = new Task({
      userId: req.userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: subject.trim(),
      dueDate,
      priority: priority || 'Medium',
      status: status || 'Pending',
    });

    await task.save();
    return res.status(201).json({ ...task.toObject(), id: task._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating task.' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    return res.json({ ...task.toObject(), id: task._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating task.' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    return res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting task.' });
  }
});

export default router;
