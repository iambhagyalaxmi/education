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
      const gradingScales = await prisma.gradingScale.findMany({
        orderBy: { minScore: 'desc' }
      });
      return res.status(200).json(gradingScales);
    }

    if (req.method === 'POST') {
      const { grade, minScore, maxScore, gpa } = req.body;
      if (!grade || minScore === undefined || maxScore === undefined || gpa === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const gradingScale = await prisma.gradingScale.create({
        data: {
          grade,
          minScore: parseInt(minScore),
          maxScore: parseInt(maxScore),
          gpa: parseFloat(gpa)
        }
      });
      return res.status(201).json(gradingScale);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { grade, minScore, maxScore, gpa } = req.body;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Grading scale ID is required' });
      }

      const dataToUpdate: any = {};
      if (grade !== undefined) dataToUpdate.grade = grade;
      if (minScore !== undefined) dataToUpdate.minScore = parseInt(minScore);
      if (maxScore !== undefined) dataToUpdate.maxScore = parseInt(maxScore);
      if (gpa !== undefined) dataToUpdate.gpa = parseFloat(gpa);

      const gradingScale = await prisma.gradingScale.update({
        where: { id },
        data: dataToUpdate
      });
      
      return res.status(200).json(gradingScale);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Grading scale ID is required' });
      }

      await prisma.gradingScale.delete({
        where: { id }
      });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Grading API Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'This grade already exists in the database.' });
    }
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
