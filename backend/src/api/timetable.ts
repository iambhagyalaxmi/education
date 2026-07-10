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
      const entries = await prisma.timetableEntry.findMany({ orderBy: [{ day: 'asc' }, { time: 'asc' }] });
      return res.status(200).json(entries);
    }
    if (req.method === 'POST') {
      const { day, time, subject, faculty, room, course } = req.body;
      const newEntry = await prisma.timetableEntry.create({
        data: { day, time, subject, faculty, room, course }
      });
      return res.status(201).json(newEntry);
    }
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing ID' });
      const { day, time, subject, faculty, room, course } = req.body;
      const updatedEntry = await prisma.timetableEntry.update({
        where: { id },
        data: { day, time, subject, faculty, room, course }
      });
      return res.status(200).json(updatedEntry);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await prisma.timetableEntry.delete({ where: { id } });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Timetable API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
