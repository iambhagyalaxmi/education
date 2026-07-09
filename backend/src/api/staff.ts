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
      const { role } = req.query;
      const staff = await prisma.user.findMany({
        where: {
          role: role ? String(role) : { not: 'student' }
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(staff);
    }

    if (req.method === 'POST') {
      const { name, email, phone, role, department } = req.body;
      const newStaff = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          role: role || 'faculty',
          department
        }
      });
      return res.status(201).json(newStaff);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const updatedStaff = await prisma.user.update({
        where: { id: String(id) },
        data: req.body
      });
      return res.status(200).json(updatedStaff);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.user.delete({
        where: { id: String(id) }
      });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Staff API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
