const express = require('express');
const router = express.Router();
const CV = require('../models/CV');
const authMiddleware = require('../middleware/auth');

// All CV routes are protected
router.use(authMiddleware);

// GET /api/cvs — all CVs for current user
router.get('/', async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(cvs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/cvs — create new CV
router.post('/', async (req, res) => {
  try {
    const { title, cvData, settings, language } = req.body;
    const cv = await CV.create({
      userId: req.user.id,
      title: title || 'Mi CV Principal',
      cvData: cvData || {},
      settings: settings || { template: 'modern', accentColor: 'blue', fontSize: 'normal' },
      language: language || 'es',
    });
    res.status(201).json(cv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/cvs/:id — single CV (owned by user)
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

// PUT /api/cvs/:id — update CV
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

// DELETE /api/cvs/:id — delete CV
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

module.exports = router;
