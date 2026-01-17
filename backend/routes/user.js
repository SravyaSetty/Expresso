
const router = require('express').Router();
const User = require('../models/user.model');

router.post('/questionnaire', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { ...answers, hasCompletedQuestionnaire: true }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId/latest-summary', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user && user.summaries.length > 0) {
      res.json(user.summaries[user.summaries.length - 1]);
    } else {
      res.status(404).json({ message: 'No summaries found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
