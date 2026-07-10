import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const leaveRequests = await prisma.leaveRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      });
      return res.status(200).json(leaveRequests);
    }

    if (req.method === 'POST') {
      const { type, duration, reason, fromDate, toDate, userId } = req.body;
      
      let actualUserId = userId;
      if (!actualUserId) {
        // Fallback to the first user if no userId is provided (since this is a mockup transitioning to fullstack)
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          actualUserId = firstUser.id;
        } else {
          return res.status(400).json({ error: 'No user found in database to associate leave request.' });
        }
      }

      // Format dates into the duration string if needed, or just save what the frontend sends
      const formattedDuration = duration || `${fromDate} to ${toDate}`;

      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          type,
          duration: formattedDuration,
          reason,
          userId: actualUserId,
          status: 'Pending'
        }
      });

      return res.status(201).json(leaveRequest);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Leave Request API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
