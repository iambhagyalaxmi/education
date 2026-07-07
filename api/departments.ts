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
      const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
      return res.status(200).json(departments);
    }
    if (req.method === 'POST') {
      const { name, code, hod, faculty, students, status } = req.body;
      const newDept = await prisma.department.create({
        data: { name, code, hod, faculty: parseInt(faculty) || 0, students: parseInt(students) || 0, status: status || 'Active' }
      });
      return res.status(201).json(newDept);
    }
    if (req.method === 'PUT') {
      const id = req.query.id as string || req.body.id;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const updated = await prisma.department.update({ where: { id }, data: req.body });
      return res.status(200).json(updated);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await prisma.department.delete({ where: { id } });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Departments API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
