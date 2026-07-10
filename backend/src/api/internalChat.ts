import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function internalChatHandler(req: Request, res: Response) {
  try {
    if (req.method === 'GET') {
      const { chatId } = req.query;

      if (chatId) {
        // Fetch messages for a specific chat
        const messages = await prisma.internalChatMessage.findMany({
          where: { chatId: String(chatId) },
          orderBy: { createdAt: 'asc' },
        });
        return res.status(200).json(messages);
      } else {
        // Fetch all chat groups
        const chats = await prisma.internalChat.findMany({
          orderBy: { updatedAt: 'desc' },
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1, // Get the latest message for preview
            }
          }
        });
        return res.status(200).json(chats);
      }
    }

    if (req.method === 'POST') {
      const { action, name, type, chatId, senderId, senderName, content } = req.body;

      if (action === 'CREATE_CHAT') {
        const chat = await prisma.internalChat.create({
          data: {
            name: name || 'New Group',
            type: type || 'Group',
          },
        });
        return res.status(201).json(chat);
      } 
      
      if (action === 'SEND_MESSAGE') {
        if (!chatId || !senderId || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const message = await prisma.internalChatMessage.create({
          data: {
            chatId: String(chatId),
            senderId: String(senderId),
            senderName: String(senderName || 'Unknown User'),
            content: String(content),
          },
        });

        // Update the chat's updatedAt timestamp
        await prisma.internalChat.update({
          where: { id: String(chatId) },
          data: { updatedAt: new Date() }
        });

        return res.status(201).json(message);
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Chat ID required' });
      await prisma.internalChat.delete({ where: { id: String(id) } });
      return res.status(204).end();
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Internal Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
