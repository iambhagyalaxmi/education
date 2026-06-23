import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import chatRoutes from './routes/chat';
import { AIService } from './services/aiService';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Education Chatbot API is running on Vercel' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/chat', chatRoutes);

// Store conversation history in memory (Note: In production serverless, use Redis or Postgres)
const conversationHistories = new Map<string, { role: string; content: string }[]>();

app.post('/api/chat/message', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const id = sessionId || 'default-session';
  const history = conversationHistories.get(id) || [];

  try {
    const { intent, confidence } = await AIService.detectIntent(message);
    let responseText: string;

    if (confidence < 0.5) {
      responseText = "I'm not sure I fully understood your question. Could you rephrase it? Or if you need immediate help, please contact our support team at support@educationportal.com.";
    } else {
      responseText = await AIService.generateResponse(message, intent, history);
    }

    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: responseText });
    conversationHistories.set(id, history);

    res.json({ sender: 'bot', content: responseText });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Something went wrong on our end.' });
  }
});

app.post('/api/chat/reset', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) conversationHistories.delete(sessionId);
  res.json({ status: 'ok' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ REST Server is running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
