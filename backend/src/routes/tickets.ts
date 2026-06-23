import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Create ticket
router.post('/', async (req, res) => {
  const { userId, title, description, category, priority } = req.body;
  if (!userId || !title || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        userId,
        title,
        description,
        category,
        priority: priority || 'medium',
        ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`
      }
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get user tickets
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const tickets = userId 
      ? await prisma.ticket.findMany({ where: { userId: String(userId) } })
      : await prisma.ticket.findMany(); // admin only normally
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

export default router;
