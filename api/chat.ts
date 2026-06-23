import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_MESSAGE = `You are EduBot, a friendly and professional Education Customer Support Assistant for an educational institution.
You help students, parents, and educators with:
- Admissions: process, requirements, deadlines, documents needed
- Courses: available programs, curriculum details, duration, online/offline options
- Fees: tuition structure, payment methods, installment plans
- Scholarships: eligibility criteria, application process, types of scholarships
- Technical Support: portal login issues, password reset, website errors
- General Inquiries: institution information, contact details, timings

Rules:
- Be warm, helpful, and concise (aim for under 120 words per response)
- Use bullet points when listing multiple items
- Never fabricate specific fee amounts, exact dates, or policy numbers
- If you don't know specifics, say: "For exact details, please reach our team at support@educationportal.com or call +91-XXXXXXXXXX"
- Always end with an offer to help further or a follow-up question`;

// In-memory session store (works per serverless instance)
const conversationHistories = new Map<string, { role: string; content: string }[]>();

async function detectIntent(message: string): Promise<{ intent: string; confidence: number }> {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Classify the user message into exactly one category:
Admissions, Courses, Fees, Scholarships, Technical Support, General Inquiry, Complaint.
Respond with ONLY valid JSON like: {"intent": "Courses", "confidence": 0.95}
No explanation, no markdown, just the JSON object.`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.1,
      max_tokens: 60,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '{}';
    const jsonMatch = raw.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    const result = JSON.parse(jsonMatch[0]);
    return {
      intent: result.intent || 'General Inquiry',
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.85,
    };
  } catch {
    return { intent: 'General Inquiry', confidence: 0.85 };
  }
}

async function generateResponse(
  message: string,
  intent: string,
  history: { role: string; content: string }[]
): Promise<string> {
  try {
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_MESSAGE },
    ];
    for (const h of history.slice(-6)) {
      messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
    }
    messages.push({ role: 'user', content: `[Topic: ${intent}] ${message}` });

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't generate a response. Please try again."
    );
  } catch {
    return "I'm having a technical issue right now. Please contact our support team at support@educationportal.com.";
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json({ status: 'ok', message: 'EduBot API is running' });
  }

  if (req.method === 'POST') {
    const { message, sessionId, action } = req.body || {};

    // Handle reset
    if (action === 'reset') {
      if (sessionId) conversationHistories.delete(sessionId);
      return res.json({ status: 'ok' });
    }

    // Handle message
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const id = sessionId || 'default-session';
    const history = conversationHistories.get(id) || [];

    try {
      const { intent, confidence } = await detectIntent(message);
      let responseText: string;

      if (confidence < 0.5) {
        responseText =
          "I'm not sure I fully understood your question. Could you rephrase it? Or contact our support team at support@educationportal.com.";
      } else {
        responseText = await generateResponse(message, intent, history);
      }

      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: responseText });
      conversationHistories.set(id, history);

      return res.json({ sender: 'bot', content: responseText });
    } catch (error) {
      console.error('Chat handler error:', error);
      return res.status(500).json({ error: 'Something went wrong on our end.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
