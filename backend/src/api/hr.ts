import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const url = req.url || '';
    
    // Payroll
    if (url.includes('/payroll')) {
      if (req.method === 'GET') {
        const records = await prisma.payrollRecord.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        });
        const formatted = records.map(r => ({
          id: r.id,
          name: r.user.name,
          role: r.user.role,
          dept: r.user.department || 'General',
          month: r.month,
          base: r.baseSalary,
          allow: r.allowances,
          net: r.netPayable,
          status: r.status
        }));
        return res.status(200).json(formatted);
      }
      if (req.method === 'POST') {
        const { userId, month, baseSalary, allowances, netPayable, status } = req.body;
        const newRecord = await prisma.payrollRecord.create({
          data: { userId, month, baseSalary, allowances, netPayable, status: status || 'Completed' }
        });
        return res.status(201).json(newRecord);
      }
      if (req.method === 'PUT') {
        const { id, month, baseSalary, allowances, netPayable, status } = req.body;
        if (!id) return res.status(400).json({ error: 'Missing payroll ID' });
        const updatedRecord = await prisma.payrollRecord.update({
          where: { id },
          data: { month, baseSalary, allowances, netPayable, status: status || 'Completed' }
        });
        return res.status(200).json(updatedRecord);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing payroll ID' });
        await prisma.payrollRecord.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // Leave
    if (url.includes('/leave')) {
      if (req.method === 'GET') {
        const requests = await prisma.leaveRequest.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        });
        const formatted = requests.map(r => ({
          id: r.id,
          name: r.user.name,
          type: r.type,
          duration: r.duration,
          reason: r.reason,
          status: r.status
        }));
        return res.status(200).json(formatted);
      }
      if (req.method === 'POST') {
        const { userId, type, duration, reason, status } = req.body;
        const newReq = await prisma.leaveRequest.create({
          data: { userId, type, duration, reason, status: status || 'Pending' }
        });
        return res.status(201).json(newReq);
      }
      if (req.method === 'PUT') {
        const { id } = req.query; // in next.js/vercel id can come from query if it's [id].ts, or we can just pass it in body
        // let's try getting id from url /api/hr/leave?id=xxx
        const targetId = req.query.id as string || req.body.id;
        const { status } = req.body;
        if (!targetId) return res.status(400).json({ error: 'Missing ID' });
        const updatedReq = await prisma.leaveRequest.update({
          where: { id: targetId },
          data: { status }
        });
        return res.status(200).json(updatedReq);
      }
    }

  } catch (error: any) {
    console.error('HR API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
