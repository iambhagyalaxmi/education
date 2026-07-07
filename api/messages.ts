import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const msgs = await prisma.appMessage.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(msgs);
    }

    if (req.method === 'POST') {
      const { type, audience, subject, body } = req.body;
      const msg = await prisma.appMessage.create({
        data: { type, audience, subject, body }
      });
      return res.status(201).json(msg);
    }
  } catch (error: any) {
    console.error('Messages API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
