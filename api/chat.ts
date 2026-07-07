import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';

// Load .env from the backend root directory
dotenvConfig({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';


const SYSTEM_MESSAGE = [
  'You are EduBot, a friendly, professional, and helpful Customer Support Assistant for our institute. Your primary goal is to provide accurate, clear, and student-friendly responses while maintaining a warm and welcoming tone.',
  '',
  '### Personality & Tone',
  '- Be friendly, polite, and approachable.',
  '- Communicate in simple, easy-to-understand language.',
  '- Sound supportive and patient, especially when answering student and parent queries.',
  '- Use positive and encouraging language.',
  '- Show empathy when users are confused or facing issues.',
  '',
  '### Response Guidelines',
  '- Greet users warmly and acknowledge their questions.',
  '- Provide concise and accurate answers based on the available knowledge base and database.',
  '- Explain fees, admissions, courses, eligibility, placements, scholarships, and institute policies in a clear manner.',
  '- When presenting numbers or fees, use tables or bullet points whenever possible.',
  '- Ask follow-up questions if additional information is required.',
  '- You MUST communicate fluently in the language the user speaks. Detect their language and respond accordingly.',
  '',
  '### Customer Experience',
  '- Prioritize Fast Support, Smart Automation, Omnichannel Service, AI Insights, and Higher Customer Satisfaction.',
  '- Offer step-by-step guidance whenever appropriate.',
  '- Thank users for their questions and invite them to ask additional questions.',
  '',
  '### Escalation Rules',
  '- Never guess or create information.',
  '- If information is unavailable, outside your scope, or not found in the database, politely inform the user and immediately direct them to the institute\'s official email, phone number, or support team.',
  '- For complex issues requiring human intervention, create a support ticket and provide escalation instructions.',
  '',
  '### Prohibited Behaviors',
  '- Do not provide misleading, speculative, or unverified information.',
  '- Do not use rude, robotic, overly technical, or negative language.',
  '- Do not discuss topics unrelated to the institute\'s services.',
  '',
  '### Tools Available',
  'You have tools to fetch LIVE data from the database. Use them whenever asked about:',
  '- Fees (getFeeStructure)',
  '- Student Statistics / Batch Enrollment (getBatchStatistics)',
  '- Course Comparison (compareCourses)',
  '- Counselor Handoff / Complaints (createSupportTicket)',
  '- Official Documents / Forms / Brochures (searchDocuments)',
  '- Course Recommendations & Eligibility (recommendCourses)',
  '',
  '### Course Recommendation Workflow',
  'When a user asks for course recommendations (e.g. "Which course is best after 12th?", "I scored 75% in Science"):',
  '1. If you don\'t have enough information (like qualification, stream, or percentage), ask ONE follow-up question at a time. Do not overwhelm them.',
  '2. Once you have enough context, call the `recommendCourses` tool.',
  '3. Use the tool\'s response to output a beautifully formatted JSON block at the end of your message so the UI can render Course Cards.',
  'Format it EXACTLY like this (inside a ```json code block):',
  '{',
  '  "courses": [',
  '    {',
  '      "id": "course_id",',
  '      "name": "Course Name",',
  '      "duration": "4 Years",',
  '      "annualFee": "₹95,000",',
  '      "eligibility": "✅ Eligible",',
  '      "scholarship": "Merit Scholarship Available",',
  '      "placementRate": "92%",',
  '      "careers": "Software Engineer, Data Analyst",',
  '      "brochureUrl": "/docs/brochure.pdf",',
  '      "applyUrl": "/apply"',
  '    }',
  '  ]',
  '}',
  'If they are NOT eligible, clearly state why and suggest alternatives. Never invent courses or fees.',
  '',
  '### Document Formatting',
  'When a user asks for a document, use the searchDocuments tool. If documents are found, respond normally but ALSO include a structured JSON block at the end of your message to render the document cards in the UI.',
  'Format it EXACTLY like this (inside a ```json code block):',
  '{',
  '  "documents": [',
  '    {',
  '      "id": "doc_id",',
  '      "title": "Document Title",',
  '      "description": "Short description",',
  '      "academicYear": "2026-27",',
  '      "lastUpdated": "2026-06-25",',
  '      "fileUrl": "/docs/file.pdf"',
  '    }',
  '  ]',
  '}',
  'If multiple documents match, return up to 5 in the JSON array and ask the user which one they need. If no documents are found, politely suggest similar ones or handoff.',
  '',
  '### Suggestions Requirement',
  'At the end of EVERY response, suggest 2-3 short follow-up questions the user can ask. Format them EXACTLY like this on new lines at the very end of your message:',
  '[SUGGESTION] Question 1?',
  '[SUGGESTION] Question 2?',
].join('\n');

// --- DB Tool Functions ---

async function getFeeStructure(courseCode: string) {
  const course = await prisma.course.findUnique({
    where: { code: courseCode },
    include: { feeStructures: { orderBy: { academicYear: 'desc' }, take: 1 } },
  });
  if (!course || course.feeStructures.length === 0) return JSON.stringify({ error: `Fee structure not found for ${courseCode}` });
  return JSON.stringify(course.feeStructures[0]);
}

async function getBatchStatistics(courseCode: string, startYear: number) {
  const batch = await prisma.batch.findFirst({
    where: { course: { code: courseCode }, startYear },
    include: { statistic: true },
  });
  if (!batch || !batch.statistic) return JSON.stringify({ error: `Statistics not found for ${courseCode} batch ${startYear}` });
  return JSON.stringify(batch.statistic);
}

async function compareCourses(courseCodes: string[]) {
  const courses = await prisma.course.findMany({
    where: { code: { in: courseCodes } },
    include: { feeStructures: { orderBy: { academicYear: 'desc' }, take: 1 } },
  });
  return JSON.stringify(courses);
}

async function createSupportTicket(title: string, description: string, userEmail?: string, sessionId?: string) {
  let userId = null;
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) userId = user.id;
  }
  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      category: 'Handoff',
      userId,
      sessionId,
    },
  });
  return JSON.stringify({ success: true, ticketNumber: ticket.ticketNumber, message: "A counselor will review this ticket." });
}

// --- Groq Tool Definitions ---

const tools: Groq.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getFeeStructure',
      description: 'Get the latest fee structure (admission, tuition, total) for a specific course.',
      parameters: {
        type: 'object',
        properties: { courseCode: { type: 'string', description: 'e.g., BCA, BSc, MCA, BTech' } },
        required: ['courseCode'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getBatchStatistics',
      description: 'Get enrollment and graduation statistics for a specific course batch.',
      parameters: {
        type: 'object',
        properties: {
          courseCode: { type: 'string' },
          startYear: { type: 'integer', description: 'The starting year of the batch, e.g., 2024' },
        },
        required: ['courseCode', 'startYear'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compareCourses',
      description: 'Compare multiple courses and their fees.',
      parameters: {
        type: 'object',
        properties: { courseCodes: { type: 'array', items: { type: 'string' }, description: 'Array of course codes like ["BCA", "BTech"]' } },
        required: ['courseCodes'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createSupportTicket',
      description: 'Create a support ticket for a user when they request a human counselor, have a complaint, or a technical issue.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          userEmail: { type: 'string' },
        },
        required: ['title', 'description'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'queryAuditLogs',
      description: 'Query the database audit logs to see exactly who changed what data, when, and why. Use this to investigate modifications to records.',
      parameters: {
        type: 'object',
        properties: {
          tableName: { type: 'string', description: 'e.g., Student, Course, FeeStructure, Application' },
          actionType: { type: 'string', description: 'e.g., INSERT, UPDATE, DELETE' },
          limit: { type: 'integer', description: 'Max number of logs to return (default 5)' }
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchDocuments',
      description: 'Search for official institute documents, forms, brochures, fee structures, policies, and certificates.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The search query or keyword (e.g., "hostel form", "admission brochure")' }
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'recommendCourses',
      description: 'Recommend courses based on student profile (qualification, stream, percentage).',
      parameters: {
        type: 'object',
        properties: {
          qualification: { type: 'string', description: 'e.g., 12th, Graduation' },
          stream: { type: 'string', description: 'e.g., Science, Commerce, Arts' },
          percentage: { type: 'number', description: 'e.g., 75' },
          careerInterest: { type: 'string' }
        },
        required: [],
      },
    },
  },
];

async function queryAuditLogs(tableName?: string, actionType?: string, limit: number = 5) {
  const where: any = {};
  if (tableName) where.tableName = tableName;
  if (actionType) where.actionType = actionType;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { name: true, email: true, role: true } } }
  });

  if (logs.length === 0) return JSON.stringify({ message: "No audit logs found matching criteria." });
  return JSON.stringify(logs);
}

async function searchDocuments(query: string) {
  const docs = await prisma.document.findMany({
    where: {
      status: 'active',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 5,
    orderBy: { updatedAt: 'desc' }
  });

  if (docs.length === 0) return JSON.stringify({ message: "No document found matching this query." });
  return JSON.stringify(docs);
}

async function recommendCourses(qualification?: string, stream?: string, percentage?: number, careerInterest?: string) {
  const courses = await prisma.course.findMany({
    include: {
      eligibilityCriteria: true,
      scholarships: true,
      placement: true,
      careerPaths: true,
      feeStructures: { orderBy: { academicYear: 'desc' }, take: 1 }
    }
  });

  let recommended = courses.map(course => {
    let isEligible = true;
    let missingReason = '';

    const ec = course.eligibilityCriteria;
    if (ec) {
      if (qualification && ec.requiredQuals.length > 0 && !ec.requiredQuals.includes(qualification)) {
        isEligible = false;
        missingReason = `Requires ${ec.requiredQuals.join(' or ')}`;
      }
      if (stream && ec.allowedStreams.length > 0 && !ec.allowedStreams.includes('Any') && !ec.allowedStreams.includes(stream)) {
        isEligible = false;
        missingReason = `Stream must be ${ec.allowedStreams.join(' or ')}`;
      }
      if (percentage && ec.minPercentage && percentage < ec.minPercentage) {
        isEligible = false;
        missingReason = `Requires minimum ${ec.minPercentage}%`;
      }
    }

    return {
      course,
      isEligible,
      missingReason
    };
  });

  // Simple sorting: eligible first
  recommended.sort((a, b) => (a.isEligible === b.isEligible ? 0 : a.isEligible ? -1 : 1));

  return JSON.stringify({
    message: "Use this data to format your JSON response for the course cards.",
    results: recommended.slice(0, 4)
  });
}

async function generateResponse(message: string, sessionId: string): Promise<{ text: string, suggestions: string[] }> {
  // 1. Fetch persistent conversation
  let conversation = await prisma.conversation.findFirst({
    where: { sessionId },
    include: { messages: { orderBy: { timestamp: 'asc' }, take: 10 } },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { sessionId },
      include: { messages: true },
    });
  }

  // 2. Build Groq messages array
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_MESSAGE },
  ];
  for (const msg of conversation.messages) {
    messages.push({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content });
  }
  messages.push({ role: 'user', content: message });

  // 3. Save User Message
  await prisma.message.create({
    data: { conversationId: conversation.id, sender: 'user', content: message },
  });

  // 4. Call Groq
  let response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    tools,
    tool_choice: 'auto',
    temperature: 0.7,
  });

  let responseMessage = response.choices[0]?.message;

  // 5. Handle Tool Calling Loop
  while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
    messages.push(responseMessage); // Add assistant's tool call request to messages

    for (const toolCall of responseMessage.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments || '{}');
      let toolResult = '';

      try {
        if (toolCall.function.name === 'getFeeStructure') {
          toolResult = await getFeeStructure(args.courseCode);
        } else if (toolCall.function.name === 'getBatchStatistics') {
          toolResult = await getBatchStatistics(args.courseCode, args.startYear);
        } else if (toolCall.function.name === 'compareCourses') {
          toolResult = await compareCourses(args.courseCodes);
        } else if (toolCall.function.name === 'createSupportTicket') {
          toolResult = await createSupportTicket(args.title, args.description, args.userEmail, sessionId);
        } else if (toolCall.function.name === 'queryAuditLogs') {
          toolResult = await queryAuditLogs(args.tableName, args.actionType, args.limit);
        } else if (toolCall.function.name === 'searchDocuments') {
          toolResult = await searchDocuments(args.query);
        } else if (toolCall.function.name === 'recommendCourses') {
          toolResult = await recommendCourses(args.qualification, args.stream, args.percentage, args.careerInterest);
        }
      } catch (e: any) {
        toolResult = JSON.stringify({ error: e.message });
      }

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: toolResult,
      });
    }

    // Call Groq again with tool results
    response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      tools,
      temperature: 0.7,
    });
    responseMessage = response.choices[0]?.message;
  }

  // 6. Extract final text and suggestions
  const fullText = responseMessage?.content?.trim() || "I'm having trouble connecting right now.";
  
  const suggestions: string[] = [];
  const textLines = fullText.split('\n');
  const cleanText = textLines.filter(line => {
    if (line.startsWith('[SUGGESTION]')) {
      suggestions.push(line.replace('[SUGGESTION]', '').trim());
      return false;
    }
    return true;
  }).join('\n').trim();

  // 7. Save Assistant Message
  await prisma.message.create({
    data: { conversationId: conversation.id, sender: 'bot', content: cleanText },
  });

  return { text: cleanText, suggestions };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { message, sessionId, action } = req.body || {};

    if (action === 'reset') {
      if (sessionId) {
        await prisma.conversation.deleteMany({ where: { sessionId } });
      }
      return res.json({ status: 'ok' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const id = sessionId || 'default-session';

    try {
      const { text, suggestions } = await generateResponse(message, id);
      return res.json({ sender: 'bot', content: text, suggestions });
    } catch (error) {
      console.error('Chat handler error:', error);
      return res.status(500).json({ error: 'Something went wrong on our end.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
