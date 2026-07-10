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
      const { subjectId } = req.query;
      
      const whereClause = subjectId ? { subjectId: String(subjectId) } : {};
      
      const syllabuses = await prisma.syllabus.findMany({
        where: whereClause,
        include: { subject: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(syllabuses);
    }

    if (req.method === 'POST') {
      const { subjectId, title, description, topics } = req.body;
      
      if (!subjectId || !title || !topics) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const syllabus = await prisma.syllabus.create({
        data: {
          subjectId,
          title,
          description,
          topics
        }
      });
      
      return res.status(201).json(syllabus);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { title, description, topics } = req.body;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Syllabus ID is required' });
      }

      const dataToUpdate: any = {};
      if (title !== undefined) dataToUpdate.title = title;
      if (description !== undefined) dataToUpdate.description = description;
      if (topics !== undefined) dataToUpdate.topics = topics;

      const syllabus = await prisma.syllabus.update({
        where: { id },
        data: dataToUpdate
      });
      
      return res.status(200).json(syllabus);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Syllabus ID is required' });
      }

      await prisma.syllabus.delete({
        where: { id }
      });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Syllabus API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
