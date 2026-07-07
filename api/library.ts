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
      const books = await prisma.libraryBook.findMany({ orderBy: { title: 'asc' } });
      return res.status(200).json(books);
    }
    if (req.method === 'POST') {
      const { title, author, isbn, category, qty, status } = req.body;
      const newBook = await prisma.libraryBook.create({
        data: { title, author, isbn, category, qty: parseInt(qty) || 1, status: status || 'In Stock' }
      });
      return res.status(201).json(newBook);
    }
    if (req.method === 'PUT') {
      const id = req.query.id as string || req.body.id;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const updated = await prisma.libraryBook.update({ where: { id }, data: req.body });
      return res.status(200).json(updated);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await prisma.libraryBook.delete({ where: { id } });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Library API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
