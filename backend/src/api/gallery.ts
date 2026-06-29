import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { category, all } = req.query;
      
      const whereClause: any = {};
      if (!all) {
        whereClause.isActive = true;
      }
      if (category) {
        whereClause.category = category;
      }

      const images = await prisma.galleryImage.findMany({
        where: whereClause,
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }]
      });
      return res.status(200).json(images);
    }

    if (req.method === 'POST') {
      const { url, title, description, category, order, isActive } = req.body;
      const newImage = await prisma.galleryImage.create({
        data: { url, title, description, category, order, isActive }
      });
      return res.status(201).json(newImage);
    }

    if (req.method === 'PUT') {
      const { id, url, title, description, category, order, isActive } = req.body;
      const updatedImage = await prisma.galleryImage.update({
        where: { id },
        data: { url, title, description, category, order, isActive }
      });
      return res.status(200).json(updatedImage);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (typeof id === 'string') {
        await prisma.galleryImage.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ error: 'Invalid ID' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Gallery API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
