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
      const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(announcements);
    }

    if (req.method === 'POST') {
      const { title, audience, status, content } = req.body;
      const ann = await prisma.announcement.create({
        data: { title, audience, status: status || 'Published', content }
      });
      return res.status(201).json(ann);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const updated = await prisma.announcement.update({
        where: { id: String(id) },
        data: req.body
      });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await prisma.announcement.delete({
        where: { id: String(id) }
      });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Announcements API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
