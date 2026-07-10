import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const exams = await prisma.examination.findMany({
        orderBy: { date: 'asc' }
      });
      return res.status(200).json(exams);
    }
    if (req.method === 'POST') {
      const { name, course, date, time, room, status } = req.body;
      const newExam = await prisma.examination.create({
        data: { name, course, date, time, room, status: status || 'Upcoming' }
      });
      return res.status(201).json(newExam);
    }
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing ID' });
      const { name, course, date, time, room, status } = req.body;
      const updatedExam = await prisma.examination.update({
        where: { id },
        data: { name, course, date, time, room, status }
      });
      return res.status(200).json(updatedExam);
    }
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing ID' });
      await prisma.examination.delete({ where: { id } });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Examinations API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
