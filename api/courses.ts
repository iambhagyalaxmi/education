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
      const courses = await prisma.course.findMany({
        include: { batches: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(courses);
    }

    if (req.method === 'POST') {
      const { code, name, durationYears, description } = req.body;
      const newCourse = await prisma.course.create({
        data: {
          code,
          name,
          durationYears: parseInt(durationYears),
          description
        }
      });
      return res.status(201).json(newCourse);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const updatedCourse = await prisma.course.update({
        where: { id: String(id) },
        data: req.body
      });
      return res.status(200).json(updatedCourse);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.course.delete({
        where: { id: String(id) }
      });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Courses API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
