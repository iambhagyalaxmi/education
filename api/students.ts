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
      const students = await prisma.student.findMany({
        include: { course: true, batch: true },
        orderBy: { joinedAt: 'desc' }
      });
      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const { firstName, lastName, email, phone, courseId, batchId, status, profilePic } = req.body;
      const newStudent = await prisma.student.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          courseId,
          batchId,
          profilePic,
          status: status || 'active'
        },
        include: { course: true, batch: true }
      });
      return res.status(201).json(newStudent);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const updatedStudent = await prisma.student.update({
        where: { id: String(id) },
        data: req.body,
        include: { course: true, batch: true }
      });
      return res.status(200).json(updatedStudent);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.student.delete({
        where: { id: String(id) }
      });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Students API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
