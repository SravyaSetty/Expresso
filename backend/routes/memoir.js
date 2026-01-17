const router = require('express').Router();
const User = require('../models/user.model');

// --- "Upsert" Endpoint: Updates an entry if it exists, otherwise creates it ---
router.post('/save', async (req, res) => {
  try {
    const { userId, date, title, content, mood } = req.body;

    if (!userId || !date || !title || !content || !mood) {
      return res.status(400).json({ message: 'Missing required fields for diary entry.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const existingEntryIndex = user.diaryEntries.findIndex(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setUTCHours(0, 0, 0, 0);
        return entryDate.getTime() === targetDate.getTime();
    });

    let savedEntry;
    if (existingEntryIndex > -1) {
      // Update existing entry
      user.diaryEntries[existingEntryIndex].title = title;
      user.diaryEntries[existingEntryIndex].content = content;
      user.diaryEntries[existingEntryIndex].mood = mood;
      savedEntry = user.diaryEntries[existingEntryIndex];
    } else {
      // Create new entry
      const newEntry = { date: targetDate, title, content, mood };
      user.diaryEntries.push(newEntry);
      savedEntry = user.diaryEntries[user.diaryEntries.length - 1];
    }

    await user.save();
    const finalEntry = user.diaryEntries.find(e => e._id.equals(savedEntry._id));
    res.status(200).json({ message: 'Diary entry saved successfully.', entry: finalEntry });

  } catch (error) {
    console.error("Error saving diary entry:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET entries endpoint
router.get('/entries/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('diaryEntries');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.diaryEntries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;