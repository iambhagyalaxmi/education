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
      if (req.method === 'PUT') {
        const { id, routeNo, name, path, vehicleId, stops } = req.body;
        if (!id) return res.status(400).json({ error: 'Missing route ID' });
        const updatedRoute = await prisma.transportRoute.update({
          where: { id },
          data: { routeNo, name, path, vehicleId: vehicleId || null, stops: parseInt(stops) }
        });
        return res.status(200).json(updatedRoute);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing route ID' });
        await prisma.transportRoute.delete({ where: { id } });
        return res.status(200).json({ success: true });
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

    // Drivers
    if (url.includes('/drivers')) {
      if (req.method === 'GET') {
        const drivers = await prisma.transportDriver.findMany();
        return res.status(200).json(drivers);
      }
      if (req.method === 'POST') {
        const { name, license, vehicle, route } = req.body;
        const newDriver = await prisma.transportDriver.create({
          data: { name, license, vehicle: vehicle || 'Unassigned', route: route || 'Unassigned' }
        });
        return res.status(201).json(newDriver);
      }
      if (req.method === 'PUT') {
        const { id, name, license, vehicle, route } = req.body;
        if (!id) return res.status(400).json({ error: 'Missing driver ID' });
        const updatedDriver = await prisma.transportDriver.update({
          where: { id },
          data: { name, license, vehicle: vehicle || 'Unassigned', route: route || 'Unassigned' }
        });
        return res.status(200).json(updatedDriver);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing driver ID' });
        await prisma.transportDriver.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

  } catch (error: any) {
    console.error('Transport API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
