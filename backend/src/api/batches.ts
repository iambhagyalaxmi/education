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
      const batches = await prisma.batch.findMany({
        include: { course: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(batches);
    }

    if (req.method === 'POST') {
      const { courseId, academicYear, startYear, endYear } = req.body;
      const newBatch = await prisma.batch.create({
        data: {
          courseId,
          academicYear,
          startYear: parseInt(startYear),
          endYear: parseInt(endYear)
        }
      });
      return res.status(201).json(newBatch);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.batch.delete({
        where: { id: String(id) }
      });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Batches API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
