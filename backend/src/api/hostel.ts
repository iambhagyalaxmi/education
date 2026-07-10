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
    
    // Rooms
    if (url.includes('/rooms')) {
      if (req.method === 'GET') {
        const rooms = await prisma.hostelRoom.findMany({
          include: { allocations: true },
          orderBy: { roomNumber: 'asc' }
        });
        const formatted = rooms.map(r => ({
          id: r.id,
          room: r.roomNumber,
          block: r.block,
          type: r.roomType,
          total: r.totalBeds,
          occ: r.allocations.filter(a => a.status === 'Allocated').length,
          status: r.status
        }));
        return res.status(200).json(formatted);
      }
      if (req.method === 'POST') {
        const { roomNumber, block, roomType, totalBeds, status } = req.body;
        const newRoom = await prisma.hostelRoom.create({
          data: { roomNumber, block, roomType, totalBeds: parseInt(totalBeds), status: status || 'Available' }
        });
        return res.status(201).json(newRoom);
      }
      if (req.method === 'PUT') {
        const { id, roomNumber, block, roomType, totalBeds, status } = req.body;
        if (!id) return res.status(400).json({ error: 'Missing room ID' });
        const updatedRoom = await prisma.hostelRoom.update({
          where: { id },
          data: { roomNumber, block, roomType, totalBeds: parseInt(totalBeds), status: status || 'Available' }
        });
        return res.status(200).json(updatedRoom);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing room ID' });
        // Delete all associated allocations first
        await prisma.hostelAllocation.deleteMany({ where: { roomId: id } });
        await prisma.hostelRoom.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // Allocations
    if (url.includes('/allocations')) {
      if (req.method === 'GET') {
        const allocations = await prisma.hostelAllocation.findMany({
          include: { student: true, room: true },
          orderBy: { createdAt: 'desc' }
        });
        const formatted = allocations.map(a => ({
          id: a.id,
          student: `${a.student.firstName} ${a.student.lastName}`,
          studentId: a.student.id,
          room: a.room.roomNumber,
          block: a.room.block,
          status: a.status
        }));
        return res.status(200).json(formatted);
      }
      if (req.method === 'POST') {
        const { studentId, roomId, status } = req.body;
        const newAllocation = await prisma.hostelAllocation.create({
          data: { studentId, roomId, status: status || 'Allocated' }
        });
        return res.status(201).json(newAllocation);
      }
      if (req.method === 'PUT') {
        const { id, studentId, roomId, status } = req.body;
        if (!id) return res.status(400).json({ error: 'Missing allocation ID' });
        const updatedAlloc = await prisma.hostelAllocation.update({
          where: { id },
          data: { studentId, roomId, status: status || 'Allocated' }
        });
        return res.status(200).json(updatedAlloc);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing allocation ID' });
        await prisma.hostelAllocation.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

  } catch (error: any) {
    console.error('Hostel API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
