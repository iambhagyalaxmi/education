import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: Request, res: Response) {
  try {
    if (req.method === 'GET') {
      const assignments = await prisma.assignment.findMany({ orderBy: { dueDate: 'asc' } });
      return res.status(200).json(assignments);
    }
    
    if (req.method === 'POST') {
      const { course, title, dueDate, totalMarks, status } = req.body;
      const newAssignment = await prisma.assignment.create({ 
        data: { course, title, dueDate: new Date(dueDate), totalMarks: parseInt(totalMarks), status: status || 'Published' } 
      });
      return res.status(201).json(newAssignment);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { course, title, dueDate, totalMarks, status } = req.body;
      if (id) {
        const updatedAssignment = await prisma.assignment.update({
          where: { id: String(id) },
          data: { course, title, dueDate: dueDate ? new Date(dueDate) : undefined, totalMarks: totalMarks ? parseInt(totalMarks) : undefined, status }
        });
        return res.status(200).json(updatedAssignment);
      }
      return res.status(400).json({ error: 'Assignment ID required' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (id) await prisma.assignment.delete({ where: { id: String(id) } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
