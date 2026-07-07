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
      const materials = await prisma.document.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(materials);
    }

    if (req.method === 'POST') {
      const { title, description, fileType, fileSize } = req.body;
      
      // Find or create a default category for Course Materials
      let category = await prisma.documentCategory.findUnique({
        where: { name: 'Course Material' }
      });
      
      if (!category) {
        category = await prisma.documentCategory.create({
          data: {
            name: 'Course Material',
            description: 'Materials uploaded by Faculty for courses'
          }
        });
      }

      // Generate a mock file URL based on the title
      const mockFileUrl = `/uploads/${title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileType.toLowerCase()}`;

      const newMaterial = await prisma.document.create({
        data: {
          title,
          description: description || title,
          fileType: fileType.toUpperCase(),
          fileSize: parseInt(fileSize) || 1024,
          fileUrl: mockFileUrl,
          categoryId: category.id,
          keywords: [],
          status: 'active'
        }
      });
      
      return res.status(201).json(newMaterial);
    }
  } catch (error: any) {
    console.error('Materials API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
