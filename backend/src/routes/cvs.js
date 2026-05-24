import express from 'express';
import CV from '../models/CV.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(cvs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, cvData, settings, language } = req.body;
    const cv = await CV.create({
      userId: req.user.id,
      title: title || 'Mi CV Principal',
      cvData: cvData || {},
      settings: settings || { template: 'modern', accentColor: 'blue', fontSize: 'normal', fontFamily: 'inter' },
      language: language || 'es',
    });
    res.status(201).json(cv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cv) return res.status(404).json({ message: 'CV not found.' });
    res.json(cv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, cvData, settings, language } = req.body;
    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, cvData, settings, language },
      { new: true, runValidators: true }
    );
    if (!cv) return res.status(404).json({ message: 'CV not found.' });
    res.json(cv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!cv) return res.status(404).json({ message: 'CV not found.' });
    res.json({ message: 'CV deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
