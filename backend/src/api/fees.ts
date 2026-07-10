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
      const records = await prisma.feeRecord.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(records);
    }
    if (req.method === 'POST') {
      const { student, course, amount, dueDate, status, invoiceNo } = req.body;
      const newRecord = await prisma.feeRecord.create({
        data: { student, course, amount, dueDate, status: status || 'Pending', invoiceNo }
      });
      return res.status(201).json(newRecord);
    }
    if (req.method === 'PUT') {
      const targetId = req.query.id as string || req.body.id;
      const { student, course, amount, dueDate, status, invoiceNo } = req.body;
      if (!targetId) return res.status(400).json({ error: 'Missing ID' });
      const updatedRecord = await prisma.feeRecord.update({
        where: { id: targetId },
        data: { student, course, amount, dueDate, status, invoiceNo }
      });
      return res.status(200).json(updatedRecord);
    }
    if (req.method === 'DELETE') {
      const targetId = req.query.id as string || req.body.id;
      if (!targetId) return res.status(400).json({ error: 'Missing ID' });
      await prisma.feeRecord.delete({
        where: { id: targetId }
      });
      return res.status(204).end();
    }
  } catch (error: any) {
    console.error('Fees API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
