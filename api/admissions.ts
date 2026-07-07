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
      const apps = await prisma.admissionApplication.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(apps);
    }
    if (req.method === 'POST') {
      const { appId, name, course, date, status, score } = req.body;
      const newApp = await prisma.admissionApplication.create({
        data: { appId, name, course, date, status: status || 'Pending', score }
      });
      return res.status(201).json(newApp);
    }
    if (req.method === 'PUT') {
      const targetId = req.query.id as string || req.body.id;
      const { status } = req.body;
      if (!targetId) return res.status(400).json({ error: 'Missing ID' });
      const updatedApp = await prisma.admissionApplication.update({
        where: { id: targetId },
        data: { status }
      });
      return res.status(200).json(updatedApp);
    }
  } catch (error: any) {
    console.error('Admissions API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
