import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const meetings = await prisma.meeting.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(meetings);
    }

    if (req.method === 'POST') {
      const { course, type, platform, link, date, startTime, duration } = req.body;
      
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return res.status(400).json({ error: 'No user found in database.' });
      }

      const meeting = await prisma.meeting.create({
        data: {
          course,
          type,
          platform,
          link,
          date,
          startTime,
          duration: String(duration),
          active: true,
          userId: firstUser.id
        }
      });

      return res.status(201).json(meeting);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Meeting ID is required' });

      const deletedMeeting = await prisma.meeting.delete({
        where: { id: String(id) }
      });
      return res.status(200).json(deletedMeeting);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Meetings API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
