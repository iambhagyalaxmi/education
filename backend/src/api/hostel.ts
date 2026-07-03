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
    }

  } catch (error: any) {
    console.error('Hostel API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
