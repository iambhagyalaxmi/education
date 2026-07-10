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
      const semesters = await prisma.semester.findMany({
        orderBy: { startDate: 'desc' }
      });
      return res.status(200).json(semesters);
    }

    if (req.method === 'POST') {
      const { name, startDate, endDate, status } = req.body;
      
      if (!name || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const semester = await prisma.semester.create({
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: status || 'Upcoming'
        }
      });
      
      return res.status(201).json(semester);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, startDate, endDate, status } = req.body;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Semester ID is required' });
      }

      const dataToUpdate: any = {};
      if (name !== undefined) dataToUpdate.name = name;
      if (startDate !== undefined) dataToUpdate.startDate = new Date(startDate);
      if (endDate !== undefined) dataToUpdate.endDate = new Date(endDate);
      if (status !== undefined) dataToUpdate.status = status;

      const semester = await prisma.semester.update({
        where: { id },
        data: dataToUpdate
      });
      
      return res.status(200).json(semester);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Semester ID is required' });
      }

      await prisma.semester.delete({
        where: { id }
      });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Semesters API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
