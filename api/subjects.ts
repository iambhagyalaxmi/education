import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const subjects = await prisma.subject.findMany({
        include: { course: true },
        orderBy: [{ course: { name: 'asc' } }, { semester: 'asc' }]
      });
      return res.status(200).json(subjects);
    }

    if (req.method === 'POST') {
      const { courseId, code, name, semester, credits, type } = req.body;
      
      if (!courseId || !code || !name || !semester) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const subject = await prisma.subject.create({
        data: {
          courseId,
          code,
          name,
          semester: parseInt(semester),
          credits: parseInt(credits) || 3,
          type: type || 'core'
        }
      });
      
      return res.status(201).json(subject);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Subject ID is required' });
      }

      await prisma.subject.delete({
        where: { id }
      });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Subjects API Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A subject with this code already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
