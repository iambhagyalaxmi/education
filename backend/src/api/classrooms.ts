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
      const classrooms = await prisma.classroom.findMany({
        orderBy: { room: 'asc' }
      });
      return res.status(200).json(classrooms);
    }

    if (req.method === 'POST') {
      const { room, type, capacity, building, status } = req.body;
      
      if (!room || !type || !capacity || !building) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const classroom = await prisma.classroom.create({
        data: {
          room,
          type,
          capacity: parseInt(capacity),
          building,
          status: status || 'Available'
        }
      });
      
      return res.status(201).json(classroom);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { room, type, capacity, building, status } = req.body;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Classroom ID is required' });
      }

      const dataToUpdate: any = {};
      if (room !== undefined) dataToUpdate.room = room;
      if (type !== undefined) dataToUpdate.type = type;
      if (capacity !== undefined) dataToUpdate.capacity = parseInt(capacity);
      if (building !== undefined) dataToUpdate.building = building;
      if (status !== undefined) dataToUpdate.status = status;

      const classroom = await prisma.classroom.update({
        where: { id },
        data: dataToUpdate
      });
      
      return res.status(200).json(classroom);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Classroom ID is required' });
      }

      await prisma.classroom.delete({
        where: { id }
      });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Classrooms API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
