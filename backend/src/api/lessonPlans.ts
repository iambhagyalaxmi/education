import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const plans = await prisma.lessonPlan.findMany({
        orderBy: { date: 'asc' }
      });
      return res.status(200).json(plans);
    }

    if (req.method === 'POST') {
      const { topic, date, duration, objectives, tool } = req.body;
      const newPlan = await prisma.lessonPlan.create({
        data: {
          topic,
          date: new Date(date),
          duration: parseInt(duration),
          objectives,
          tool: tool || 'Standard Tool',
          status: 'Pending'
        }
      });
      return res.status(201).json(newPlan);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Plan ID is required' });
      await prisma.lessonPlan.delete({ where: { id: String(id) } });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Lesson Plans API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
