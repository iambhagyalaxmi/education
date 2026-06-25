import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      // Fetch real data from DB
      const conversationsCount = await prisma.conversation.count();
      const ticketsCount = await prisma.ticket.count();
      const resolvedTickets = await prisma.ticket.count({ where: { status: 'resolved' } });
      
      const stats = await prisma.studentStatistic.aggregate({
        _sum: { totalEnrolled: true, studentsLeft: true }
      });
      
      const resolutionRate = ticketsCount > 0 ? Math.round((resolvedTickets / ticketsCount) * 100) + '%' : '100%';
      const activeStudents = (stats._sum.totalEnrolled || 0) - (stats._sum.studentsLeft || 0);

      return res.json({
        totalConversations: conversationsCount,
        ticketVolume: ticketsCount,
        resolutionRate,
        activeStudents
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
