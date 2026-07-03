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
  } catch (error: any) {
    console.error('Examinations API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
