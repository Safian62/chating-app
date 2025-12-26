const express = require('express');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const router = express.Router();

// Get or create chat with a user
router.post('/', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
      type: 'private',
    }).populate('participants', 'name email avatar isOnline');

    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, userId],
        type: 'private',
      });
      await chat.save();
      await chat.populate('participants', 'name email avatar isOnline');
    }

    res.json(chat);
  } catch (error) {
    console.error('Create/get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all chats for current user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar isOnline')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar isOnline')
      .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

