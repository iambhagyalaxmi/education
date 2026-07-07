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
    
    // Routes
    if (url.includes('/routes')) {
      if (req.method === 'GET') {
        const routes = await prisma.transportRoute.findMany({
          include: { vehicle: true },
          orderBy: { routeNo: 'asc' }
        });
        const formatted = routes.map(r => ({
          id: r.id,
          no: r.routeNo,
          name: r.name,
          path: r.path,
          vehicle: r.vehicle ? r.vehicle.vehicleId : 'Unassigned',
          stops: r.stops
        }));
        return res.status(200).json(formatted);
      }
      if (req.method === 'POST') {
        const { routeNo, name, path, vehicleId, stops } = req.body;
        const newRoute = await prisma.transportRoute.create({
          data: { routeNo, name, path, vehicleId: vehicleId || null, stops: parseInt(stops) }
        });
        return res.status(201).json(newRoute);
      }
    }

    // Vehicles
    if (url.includes('/vehicles')) {
      if (req.method === 'GET') {
        const vehicles = await prisma.transportVehicle.findMany({
          orderBy: { vehicleId: 'asc' }
        });
        const formatted = vehicles.map(v => ({
          id: v.vehicleId, // AdminTransport uses id
          type: v.type,
          plate: v.plateNumber,
          condition: v.condition,
          status: v.status
        }));
        return res.status(200).json(formatted);
      }
      if (req.method === 'POST') {
        const { vehicleId, type, plateNumber, condition, status } = req.body;
        const newVehicle = await prisma.transportVehicle.create({
          data: { vehicleId, type, plateNumber, condition, status: status || 'Active' }
        });
        return res.status(201).json(newVehicle);
      }
    }

  } catch (error: any) {
    console.error('Transport API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
