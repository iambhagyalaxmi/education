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
      const documents = await prisma.document.findMany({
        include: { category: true, _count: { select: { downloads: true } } },
        orderBy: { updatedAt: 'desc' }
      });
      return res.status(200).json(documents);
    }

    if (req.method === 'POST') {
      const { action, documentId, userId, sessionId } = req.body;

      if (action === 'log_download') {
        const download = await prisma.documentDownload.create({
          data: {
            documentId,
            userId,
            sessionId,
          }
        });
        return res.status(200).json({ success: true, download });
      }
      
      // Admin Upload
      if (action === 'create') {
        const doc = await prisma.document.create({
          data: req.body.document
        });
        return res.status(201).json(doc);
      }
    }

    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      const doc = await prisma.document.update({
        where: { id },
        data
      });
      return res.status(200).json(doc);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await prisma.document.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Documents API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
