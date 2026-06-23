import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Get chat history for a conversation
router.get('/:conversationId/messages', async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
