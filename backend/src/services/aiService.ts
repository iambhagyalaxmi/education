import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// llama-3.3-70b-versatile: best Groq model — fast, generous free tier
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

export class AIService {
  static async detectIntent(
    message: string
  ): Promise<{ intent: string; confidence: number }> {
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
          {
            role: 'user',
            content: message,
          },
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
    } catch (error) {
      console.error('Intent detection error:', error);
      return { intent: 'General Inquiry', confidence: 0.85 };
    }
  }

  static async generateResponse(
    message: string,
    intent: string,
    conversationHistory: { role: string; content: string }[] = []
  ): Promise<string> {
    try {
      // Build messages array with history
      const messages: Groq.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_MESSAGE },
      ];

      // Add last 6 exchanges as context
      for (const h of conversationHistory.slice(-6)) {
        messages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content,
        });
      }

      messages.push({
        role: 'user',
        content: `[Topic: ${intent}] ${message}`,
      });

      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 300,
      });

      const text = completion.choices[0]?.message?.content?.trim() || '';
      return text || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Response generation error:', error);
      return "I'm having a technical issue right now. Please contact our support team at support@educationportal.com or call +91-XXXXXXXXXX.";
    }
  }
}
