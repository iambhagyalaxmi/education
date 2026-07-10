import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import Groq from 'groq-sdk';

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ============================================================
// CHAT
// ============================================================
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
  '- When presenting numbers or fees, use tables or bullet points whenever possible.',
  '- Ask follow-up questions if additional information is required.',
  '- You MUST communicate fluently in the language the user speaks.',
  '',
  '### Escalation Rules',
  '- Never guess or create information.',
  '- If information is unavailable, politely inform the user and direct them to the institute\'s official support team.',
  '- For complex issues requiring human intervention, create a support ticket.',
  '',
  '### Prohibited Behaviors',
  '- Do not provide misleading, speculative, or unverified information.',
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
  'When a user asks for course recommendations, gather qualification/stream/percentage info then call recommendCourses.',
  'Output a ```json block with format: {"courses": [{id, name, duration, annualFee, eligibility, scholarship, placementRate, careers, brochureUrl, applyUrl}]}',
  '',
  '### Document Formatting',
  'When a user asks for a document, use searchDocuments. Output a ```json block: {"documents": [{id, title, description, academicYear, lastUpdated, fileUrl}]}',
  '',
  '### Suggestions Requirement',
  'At the end of EVERY response, suggest 2-3 short follow-up questions:',
  '[SUGGESTION] Question 1?',
  '[SUGGESTION] Question 2?',
].join('\n');

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
      title, description, category: 'Handoff', userId, sessionId,
    },
  });
  return JSON.stringify({ success: true, ticketNumber: ticket.ticketNumber, message: 'A counselor will review this ticket.' });
}

async function queryAuditLogs(tableName?: string, actionType?: string, limit: number = 5) {
  const where: any = {};
  if (tableName) where.tableName = tableName;
  if (actionType) where.actionType = actionType;
  const logs = await prisma.auditLog.findMany({
    where, orderBy: { createdAt: 'desc' }, take: limit,
    include: { user: { select: { name: true, email: true, role: true } } }
  });
  if (logs.length === 0) return JSON.stringify({ message: 'No audit logs found matching criteria.' });
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
    take: 5, orderBy: { updatedAt: 'desc' }
  });
  if (docs.length === 0) return JSON.stringify({ message: 'No document found matching this query.' });
  return JSON.stringify(docs);
}

async function recommendCourses(qualification?: string, stream?: string, percentage?: number, careerInterest?: string) {
  const courses = await prisma.course.findMany({
    include: {
      eligibilityCriteria: true, scholarships: true,
      placement: true, careerPaths: true,
      feeStructures: { orderBy: { academicYear: 'desc' }, take: 1 }
    }
  });
  const recommended = courses.map(course => {
    let isEligible = true, missingReason = '';
    const ec = course.eligibilityCriteria;
    if (ec) {
      if (qualification && ec.requiredQuals.length > 0 && !ec.requiredQuals.includes(qualification)) {
        isEligible = false; missingReason = `Requires ${ec.requiredQuals.join(' or ')}`;
      }
      if (stream && ec.allowedStreams.length > 0 && !ec.allowedStreams.includes('Any') && !ec.allowedStreams.includes(stream)) {
        isEligible = false; missingReason = `Stream must be ${ec.allowedStreams.join(' or ')}`;
      }
      if (percentage && ec.minPercentage && percentage < ec.minPercentage) {
        isEligible = false; missingReason = `Requires minimum ${ec.minPercentage}%`;
      }
    }
    return { course, isEligible, missingReason };
  });
  recommended.sort((a, b) => (a.isEligible === b.isEligible ? 0 : a.isEligible ? -1 : 1));
  return JSON.stringify({ message: 'Use this data to format your JSON response for the course cards.', results: recommended.slice(0, 4) });
}

const chatTools: Groq.Chat.ChatCompletionTool[] = [
  { type: 'function', function: { name: 'getFeeStructure', description: 'Get fee structure for a course.', parameters: { type: 'object', properties: { courseCode: { type: 'string' } }, required: ['courseCode'] } } },
  { type: 'function', function: { name: 'getBatchStatistics', description: 'Get batch statistics.', parameters: { type: 'object', properties: { courseCode: { type: 'string' }, startYear: { type: 'integer' } }, required: ['courseCode', 'startYear'] } } },
  { type: 'function', function: { name: 'compareCourses', description: 'Compare courses.', parameters: { type: 'object', properties: { courseCodes: { type: 'array', items: { type: 'string' } } }, required: ['courseCodes'] } } },
  { type: 'function', function: { name: 'createSupportTicket', description: 'Create a support ticket.', parameters: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, userEmail: { type: 'string' } }, required: ['title', 'description'] } } },
  { type: 'function', function: { name: 'queryAuditLogs', description: 'Query audit logs.', parameters: { type: 'object', properties: { tableName: { type: 'string' }, actionType: { type: 'string' }, limit: { type: 'integer' } } } } },
  { type: 'function', function: { name: 'searchDocuments', description: 'Search documents.', parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } } },
  { type: 'function', function: { name: 'recommendCourses', description: 'Recommend courses.', parameters: { type: 'object', properties: { qualification: { type: 'string' }, stream: { type: 'string' }, percentage: { type: 'number' }, careerInterest: { type: 'string' } } } } },
];

async function generateResponse(message: string, sessionId: string) {
  let conversation = await prisma.conversation.findFirst({
    where: { sessionId },
    include: { messages: { orderBy: { timestamp: 'asc' }, take: 10 } },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({ data: { sessionId }, include: { messages: true } });
  }
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [{ role: 'system', content: SYSTEM_MESSAGE }];
  for (const msg of conversation.messages) {
    messages.push({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content });
  }
  messages.push({ role: 'user', content: message });
  await prisma.message.create({ data: { conversationId: conversation.id, sender: 'user', content: message } });

  let response = await groq.chat.completions.create({ model: MODEL, messages, tools: chatTools, tool_choice: 'auto', temperature: 0.7 });
  let responseMessage = response.choices[0]?.message;

  while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
    messages.push(responseMessage);
    for (const toolCall of responseMessage.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments || '{}');
      let toolResult = '';
      try {
        if (toolCall.function.name === 'getFeeStructure') toolResult = await getFeeStructure(args.courseCode);
        else if (toolCall.function.name === 'getBatchStatistics') toolResult = await getBatchStatistics(args.courseCode, args.startYear);
        else if (toolCall.function.name === 'compareCourses') toolResult = await compareCourses(args.courseCodes);
        else if (toolCall.function.name === 'createSupportTicket') toolResult = await createSupportTicket(args.title, args.description, args.userEmail, sessionId);
        else if (toolCall.function.name === 'queryAuditLogs') toolResult = await queryAuditLogs(args.tableName, args.actionType, args.limit);
        else if (toolCall.function.name === 'searchDocuments') toolResult = await searchDocuments(args.query);
        else if (toolCall.function.name === 'recommendCourses') toolResult = await recommendCourses(args.qualification, args.stream, args.percentage, args.careerInterest);
      } catch (e: any) { toolResult = JSON.stringify({ error: e.message }); }
      messages.push({ tool_call_id: toolCall.id, role: 'tool', content: toolResult });
    }
    response = await groq.chat.completions.create({ model: MODEL, messages, tools: chatTools, temperature: 0.7 });
    responseMessage = response.choices[0]?.message;
  }

  const fullText = responseMessage?.content?.trim() || "I'm having trouble connecting right now.";
  const suggestions: string[] = [];
  const cleanText = fullText.split('\n').filter(line => {
    if (line.startsWith('[SUGGESTION]')) { suggestions.push(line.replace('[SUGGESTION]', '').trim()); return false; }
    return true;
  }).join('\n').trim();
  await prisma.message.create({ data: { conversationId: conversation.id, sender: 'bot', content: cleanText } });
  return { text: cleanText, suggestions };
}

// ============================================================
// MAIN ROUTER
// ============================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Extract the route segment after /api/
  const rawUrl = (req.url || '').split('?')[0];
  const route = rawUrl.replace(/^\/api\/?/, '').split('/')[0];

  try {
    // ---- ANALYTICS ----
    if (route === 'analytics') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const conversationsCount = await prisma.conversation.count();
      const ticketsCount = await prisma.ticket.count();
      const resolvedTickets = await prisma.ticket.count({ where: { status: 'resolved' } });
      const stats = await prisma.studentStatistic.aggregate({ _sum: { totalEnrolled: true, studentsLeft: true } });
      const resolutionRate = ticketsCount > 0 ? Math.round((resolvedTickets / ticketsCount) * 100) + '%' : '100%';
      const activeStudents = (stats._sum.totalEnrolled || 0) - (stats._sum.studentsLeft || 0);
      return res.json({ totalConversations: conversationsCount, ticketVolume: ticketsCount, resolutionRate, activeStudents });
    }

    // ---- AUDIT ----
    if (route === 'audit') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const { tableName, actionType, limit = '20', page = '1' } = req.query;
      const take = Math.min(parseInt(limit as string) || 20, 100);
      const skip = (parseInt(page as string) - 1) * take;
      const where: any = {};
      if (tableName && tableName !== 'all') where.tableName = tableName;
      if (actionType && actionType !== 'all') where.actionType = actionType;
      const [logs, total, actionSummary, tableSummary, recentActivity] = await Promise.all([
        prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip, include: { user: { select: { name: true, email: true, role: true } } } }),
        prisma.auditLog.count({ where }),
        prisma.auditLog.groupBy({ by: ['actionType'], _count: { actionType: true }, orderBy: { _count: { actionType: 'desc' } } }),
        prisma.auditLog.groupBy({ by: ['tableName'], _count: { tableName: true }, orderBy: { _count: { tableName: 'desc' } } }),
        prisma.auditLog.findMany({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, select: { createdAt: true, actionType: true }, orderBy: { createdAt: 'asc' } })
      ]);
      const dailyMap: Record<string, any> = {};
      for (const log of recentActivity) {
        const day = log.createdAt.toISOString().split('T')[0];
        if (!dailyMap[day]) dailyMap[day] = { INSERT: 0, UPDATE: 0, DELETE: 0 };
        if (log.actionType === 'INSERT') dailyMap[day].INSERT++;
        else if (log.actionType === 'UPDATE') dailyMap[day].UPDATE++;
        else if (log.actionType === 'DELETE') dailyMap[day].DELETE++;
      }
      return res.json({ logs, pagination: { total, page: parseInt(page as string), take, totalPages: Math.ceil(total / take) }, stats: { total, actionSummary: actionSummary.map(a => ({ type: a.actionType, count: a._count.actionType })), tableSummary: tableSummary.map(t => ({ table: t.tableName, count: t._count.tableName })), dailyActivity: Object.entries(dailyMap).map(([date, counts]) => ({ date, ...counts })) } });
    }

    // ---- CHAT ----
    if (route === 'chat') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { message, sessionId, action } = req.body || {};
      if (action === 'reset') {
        if (sessionId) await prisma.conversation.deleteMany({ where: { sessionId } });
        return res.json({ status: 'ok' });
      }
      if (!message || typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Message is required' });
      const id = sessionId || 'default-session';
      const { text, suggestions } = await generateResponse(message, id);
      return res.json({ sender: 'bot', content: text, suggestions });
    }

    // ---- ADMISSIONS ----
    if (route === 'admissions') {
      if (req.method === 'GET') {
        const apps = await prisma.admissionApplication.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(apps);
      }
      if (req.method === 'POST') {
        const { appId, name, course, date, status, score } = req.body;
        const newApp = await prisma.admissionApplication.create({ data: { appId, name, course, date, status: status || 'Pending', score } });
        return res.status(201).json(newApp);
      }
      if (req.method === 'PUT') {
        const targetId = req.query.id as string || req.body.id;
        if (!targetId) return res.status(400).json({ error: 'Missing ID' });
        const updatedApp = await prisma.admissionApplication.update({ where: { id: targetId }, data: { status: req.body.status } });
        return res.status(200).json(updatedApp);
      }
    }

    // ---- ANNOUNCEMENTS ----
    if (route === 'announcements') {
      if (req.method === 'GET') {
        const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(announcements);
      }
      if (req.method === 'POST') {
        const { title, audience, status, content } = req.body;
        const ann = await prisma.announcement.create({ data: { title, audience, status: status || 'Published', content } });
        return res.status(201).json(ann);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const updated = await prisma.announcement.update({ where: { id: String(id) }, data: req.body });
        return res.status(200).json(updated);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        await prisma.announcement.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- BATCHES ----
    if (route === 'batches') {
      if (req.method === 'GET') {
        const batches = await prisma.batch.findMany({ include: { course: true }, orderBy: { createdAt: 'desc' } });
        return res.status(200).json(batches);
      }
      if (req.method === 'POST') {
        const { courseId, academicYear, startYear, endYear } = req.body;
        const newBatch = await prisma.batch.create({ data: { courseId, academicYear, startYear: parseInt(startYear), endYear: parseInt(endYear) } });
        return res.status(201).json(newBatch);
      }
      if (req.method === 'PUT') {
        const id = req.query.id as string || req.body.id;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const { courseId, academicYear, startYear, endYear } = req.body;
        const updatedBatch = await prisma.batch.update({
          where: { id },
          data: { courseId, academicYear, startYear: parseInt(startYear), endYear: parseInt(endYear) }
        });
        return res.status(200).json(updatedBatch);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        await prisma.batch.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- CLASSROOMS ----
    if (route === 'classrooms') {
      if (req.method === 'GET') {
        const classrooms = await prisma.classroom.findMany({ orderBy: { room: 'asc' } });
        return res.status(200).json(classrooms);
      }
      if (req.method === 'POST') {
        const { room, type, capacity, building, status } = req.body;
        if (!room || !type || !capacity || !building) return res.status(400).json({ error: 'Missing required fields' });
        const classroom = await prisma.classroom.create({ data: { room, type, capacity: parseInt(capacity), building, status: status || 'Available' } });
        return res.status(201).json(classroom);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const { room, type, capacity, building, status } = req.body;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Classroom ID is required' });
        const dataToUpdate: any = {};
        if (room !== undefined) dataToUpdate.room = room;
        if (type !== undefined) dataToUpdate.type = type;
        if (capacity !== undefined) dataToUpdate.capacity = parseInt(capacity);
        if (building !== undefined) dataToUpdate.building = building;
        if (status !== undefined) dataToUpdate.status = status;
        const classroom = await prisma.classroom.update({ where: { id }, data: dataToUpdate });
        return res.status(200).json(classroom);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Classroom ID is required' });
        await prisma.classroom.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // ---- COURSES ----
    if (route === 'courses') {
      if (req.method === 'GET') {
        const courses = await prisma.course.findMany({ include: { batches: true }, orderBy: { createdAt: 'desc' } });
        return res.status(200).json(courses);
      }
      if (req.method === 'POST') {
        const { code, name, durationYears, description } = req.body;
        const newCourse = await prisma.course.create({ data: { code, name, durationYears: parseInt(durationYears), description } });
        return res.status(201).json(newCourse);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const { code, name, durationYears, description } = req.body;
        
        // Build data object
        const dataToUpdate: any = {};
        if (code !== undefined) dataToUpdate.code = code;
        if (name !== undefined) dataToUpdate.name = name;
        if (durationYears !== undefined) dataToUpdate.durationYears = parseInt(durationYears);
        if (description !== undefined) dataToUpdate.description = description;

        const updatedCourse = await prisma.course.update({ where: { id: String(id) }, data: dataToUpdate });
        return res.status(200).json(updatedCourse);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        await prisma.course.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- DEPARTMENTS ----
    if (route === 'departments') {
      if (req.method === 'GET') {
        const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
        return res.status(200).json(departments);
      }
      if (req.method === 'POST') {
        const { name, code, hod, faculty, students, status } = req.body;
        const newDept = await prisma.department.create({ data: { name, code, hod, faculty: parseInt(faculty) || 0, students: parseInt(students) || 0, status: status || 'Active' } });
        return res.status(201).json(newDept);
      }
      if (req.method === 'PUT') {
        const id = req.query.id as string || req.body.id;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const updated = await prisma.department.update({ where: { id }, data: req.body });
        return res.status(200).json(updated);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        await prisma.department.delete({ where: { id } });
        return res.status(204).end();
      }
    }

    // ---- DOCUMENTS ----
    if (route === 'documents') {
      if (req.method === 'GET') {
        const documents = await prisma.document.findMany({ include: { category: true, _count: { select: { downloads: true } } }, orderBy: { updatedAt: 'desc' } });
        return res.status(200).json(documents);
      }
      if (req.method === 'POST') {
        const { action, documentId, userId, sessionId } = req.body;
        if (action === 'log_download') {
          const download = await prisma.documentDownload.create({ data: { documentId, userId, sessionId } });
          return res.status(200).json({ success: true, download });
        }
        if (action === 'create') {
          const doc = await prisma.document.create({ data: req.body.document });
          return res.status(201).json(doc);
        }
      }
      if (req.method === 'PUT') {
        const { id, ...data } = req.body;
        const doc = await prisma.document.update({ where: { id }, data });
        return res.status(200).json(doc);
      }
      if (req.method === 'DELETE') {
        const { id } = req.body;
        await prisma.document.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // ---- EXAMINATIONS ----
    if (route === 'examinations') {
      if (req.method === 'GET') {
        const exams = await prisma.examination.findMany({ orderBy: { date: 'asc' } });
        return res.status(200).json(exams);
      }
      if (req.method === 'POST') {
        const { name, course, date, time, room, status } = req.body;
        const newExam = await prisma.examination.create({ data: { name, course, date, time, room, status: status || 'Upcoming' } });
        return res.status(201).json(newExam);
      }
    }

    // ---- FEES ----
    if (route === 'fees') {
      if (req.method === 'GET') {
        const records = await prisma.feeRecord.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(records);
      }
      if (req.method === 'POST') {
        const { student, course, amount, dueDate, status, invoiceNo } = req.body;
        const newRecord = await prisma.feeRecord.create({ data: { student, course, amount, dueDate, status: status || 'Pending', invoiceNo } });
        return res.status(201).json(newRecord);
      }
      if (req.method === 'PUT') {
        const targetId = req.query.id as string || req.body.id;
        if (!targetId) return res.status(400).json({ error: 'Missing ID' });
        const updatedRecord = await prisma.feeRecord.update({ where: { id: targetId }, data: { status: req.body.status } });
        return res.status(200).json(updatedRecord);
      }
    }

    // ---- GALLERY ----
    if (route === 'gallery') {
      if (req.method === 'GET') {
        const { category, all } = req.query;
        const whereClause: any = {};
        if (!all) whereClause.isActive = true;
        if (category) whereClause.category = category;
        const images = await prisma.galleryImage.findMany({ where: whereClause, orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }] });
        return res.status(200).json(images);
      }
      if (req.method === 'POST') {
        const { url, title, description, category, order, isActive } = req.body;
        const newImage = await prisma.galleryImage.create({ data: { url, title, description, category, order, isActive } });
        return res.status(201).json(newImage);
      }
      if (req.method === 'PUT') {
        const { id, url, title, description, category, order, isActive } = req.body;
        const updatedImage = await prisma.galleryImage.update({ where: { id }, data: { url, title, description, category, order, isActive } });
        return res.status(200).json(updatedImage);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (typeof id === 'string') {
          await prisma.galleryImage.delete({ where: { id } });
          return res.status(200).json({ success: true });
        }
        return res.status(400).json({ error: 'Invalid ID' });
      }
    }

    // ---- GRADING ----
    if (route === 'grading') {
      if (req.method === 'GET') {
        const gradingScales = await prisma.gradingScale.findMany({ orderBy: { minScore: 'desc' } });
        return res.status(200).json(gradingScales);
      }
      if (req.method === 'POST') {
        const { grade, minScore, maxScore, gpa } = req.body;
        if (!grade || minScore === undefined || maxScore === undefined || gpa === undefined) return res.status(400).json({ error: 'Missing required fields' });
        const gradingScale = await prisma.gradingScale.create({ data: { grade, minScore: parseInt(minScore), maxScore: parseInt(maxScore), gpa: parseFloat(gpa) } });
        return res.status(201).json(gradingScale);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const { grade, minScore, maxScore, gpa } = req.body;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Grading scale ID is required' });
        const dataToUpdate: any = {};
        if (grade !== undefined) dataToUpdate.grade = grade;
        if (minScore !== undefined) dataToUpdate.minScore = parseInt(minScore);
        if (maxScore !== undefined) dataToUpdate.maxScore = parseInt(maxScore);
        if (gpa !== undefined) dataToUpdate.gpa = parseFloat(gpa);
        const gradingScale = await prisma.gradingScale.update({ where: { id }, data: dataToUpdate });
        return res.status(200).json(gradingScale);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Grading scale ID is required' });
        await prisma.gradingScale.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // ---- HOSTEL ----
    if (route === 'hostel') {
      const url = req.url || '';
      if (url.includes('/rooms')) {
        if (req.method === 'GET') {
          const rooms = await prisma.hostelRoom.findMany({ include: { allocations: true }, orderBy: { roomNumber: 'asc' } });
          return res.status(200).json(rooms.map(r => ({ id: r.id, room: r.roomNumber, block: r.block, type: r.roomType, total: r.totalBeds, occ: r.allocations.filter(a => a.status === 'Allocated').length, status: r.status })));
        }
        if (req.method === 'POST') {
          const { roomNumber, block, roomType, totalBeds, status } = req.body;
          const newRoom = await prisma.hostelRoom.create({ data: { roomNumber, block, roomType, totalBeds: parseInt(totalBeds), status: status || 'Available' } });
          return res.status(201).json(newRoom);
        }
      }
      if (url.includes('/allocations')) {
        if (req.method === 'GET') {
          const allocations = await prisma.hostelAllocation.findMany({ include: { student: true, room: true }, orderBy: { createdAt: 'desc' } });
          return res.status(200).json(allocations.map(a => ({ id: a.id, student: `${a.student.firstName} ${a.student.lastName}`, studentId: a.student.id, room: a.room.roomNumber, block: a.room.block, status: a.status })));
        }
        if (req.method === 'POST') {
          const { studentId, roomId, status } = req.body;
          const newAllocation = await prisma.hostelAllocation.create({ data: { studentId, roomId, status: status || 'Allocated' } });
          return res.status(201).json(newAllocation);
        }
      }
    }

    // ---- HR ----
    if (route === 'hr') {
      const url = req.url || '';
      if (url.includes('/payroll')) {
        if (req.method === 'GET') {
          const records = await prisma.payrollRecord.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
          return res.status(200).json(records.map(r => ({ id: r.id, name: r.user.name, role: r.user.role, dept: r.user.department || 'General', month: r.month, base: r.baseSalary, allow: r.allowances, net: r.netPayable, status: r.status })));
        }
        if (req.method === 'POST') {
          const { userId, month, baseSalary, allowances, netPayable, status } = req.body;
          const newRecord = await prisma.payrollRecord.create({ data: { userId, month, baseSalary, allowances, netPayable, status: status || 'Completed' } });
          return res.status(201).json(newRecord);
        }
      }
      if (url.includes('/leave')) {
        if (req.method === 'GET') {
          const requests = await prisma.leaveRequest.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
          return res.status(200).json(requests.map(r => ({ id: r.id, name: r.user.name, type: r.type, duration: r.duration, reason: r.reason, status: r.status })));
        }
        if (req.method === 'POST') {
          const { userId, type, duration, reason, status } = req.body;
          const newReq = await prisma.leaveRequest.create({ data: { userId, type, duration, reason, status: status || 'Pending' } });
          return res.status(201).json(newReq);
        }
        if (req.method === 'PUT') {
          const targetId = req.query.id as string || req.body.id;
          if (!targetId) return res.status(400).json({ error: 'Missing ID' });
          const updatedReq = await prisma.leaveRequest.update({ where: { id: targetId }, data: { status: req.body.status } });
          return res.status(200).json(updatedReq);
        }
      }
    }

    // ---- LIBRARY ----
    if (route === 'library') {
      if (req.method === 'GET') {
        const books = await prisma.libraryBook.findMany({ orderBy: { title: 'asc' } });
        return res.status(200).json(books);
      }
      if (req.method === 'POST') {
        const { title, author, isbn, category, qty, status } = req.body;
        const newBook = await prisma.libraryBook.create({ data: { title, author, isbn, category, qty: parseInt(qty) || 1, status: status || 'In Stock' } });
        return res.status(201).json(newBook);
      }
      if (req.method === 'PUT') {
        const id = req.query.id as string || req.body.id;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const updated = await prisma.libraryBook.update({ where: { id }, data: req.body });
        return res.status(200).json(updated);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        await prisma.libraryBook.delete({ where: { id } });
        return res.status(204).end();
      }
    }

    // ---- MATERIALS ----
    if (route === 'materials') {
      if (req.method === 'GET') {
        const materials = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(materials);
      }
      if (req.method === 'POST') {
        const { title, description, fileType, fileSize } = req.body;
        let category = await prisma.documentCategory.findUnique({ where: { name: 'Course Material' } });
        if (!category) category = await prisma.documentCategory.create({ data: { name: 'Course Material', description: 'Materials uploaded by Faculty for courses' } });
        const mockFileUrl = `/uploads/${title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileType.toLowerCase()}`;
        const newMaterial = await prisma.document.create({ data: { title, description: description || title, fileType: fileType.toUpperCase(), fileSize: parseInt(fileSize) || 1024, fileUrl: mockFileUrl, categoryId: category.id, keywords: [], status: 'active' } });
        return res.status(201).json(newMaterial);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (id) await prisma.document.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- LESSON PLANS ----
    if (route === 'lesson-plans') {
      if (req.method === 'GET') {
        const plans = await prisma.lessonPlan.findMany({ orderBy: { date: 'asc' } });
        return res.status(200).json(plans);
      }
      if (req.method === 'POST') {
        const { topic, date, duration, objectives, tool } = req.body;
        const newPlan = await prisma.lessonPlan.create({ data: { topic, date: new Date(date), duration: parseInt(duration), objectives, tool: tool || 'Standard Tool', status: 'Pending' } });
        return res.status(201).json(newPlan);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (id) await prisma.lessonPlan.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- MESSAGES ----
    if (route === 'messages') {
      if (req.method === 'GET') {
        const msgs = await prisma.appMessage.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(msgs);
      }
      if (req.method === 'POST') {
        const { type, audience, subject, body } = req.body;
        const msg = await prisma.appMessage.create({ data: { type, audience, subject, body } });
        return res.status(201).json(msg);
      }
    }

    // ---- INTERNAL CHAT ----
    if (route === 'internal-chat') {
      if (req.method === 'GET') {
        const { chatId } = req.query;
        if (chatId) {
          const messages = await prisma.internalChatMessage.findMany({ where: { chatId: String(chatId) }, orderBy: { createdAt: 'asc' } });
          return res.status(200).json(messages);
        } else {
          const chats = await prisma.internalChat.findMany({ orderBy: { updatedAt: 'desc' }, include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } } });
          return res.status(200).json(chats);
        }
      }
      if (req.method === 'POST') {
        const { action, name, type, chatId, senderId, senderName, content } = req.body;
        if (action === 'CREATE_CHAT') {
          const chat = await prisma.internalChat.create({ data: { name: name || 'New Group', type: type || 'Group' } });
          return res.status(201).json(chat);
        } 
        if (action === 'SEND_MESSAGE') {
          const message = await prisma.internalChatMessage.create({ data: { chatId: String(chatId), senderId: String(senderId), senderName: String(senderName || 'Unknown User'), content: String(content) } });
          await prisma.internalChat.update({ where: { id: String(chatId) }, data: { updatedAt: new Date() } });
          return res.status(201).json(message);
        }
        return res.status(400).json({ error: 'Invalid action' });
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (id) await prisma.internalChat.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- SEMESTERS ----
    if (route === 'semesters') {
      if (req.method === 'GET') {
        const semesters = await prisma.semester.findMany({ orderBy: { startDate: 'desc' } });
        return res.status(200).json(semesters);
      }
      if (req.method === 'POST') {
        const { name, startDate, endDate, status } = req.body;
        if (!name || !startDate || !endDate) return res.status(400).json({ error: 'Missing required fields' });
        const semester = await prisma.semester.create({ data: { name, startDate: new Date(startDate), endDate: new Date(endDate), status: status || 'Upcoming' } });
        return res.status(201).json(semester);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const { name, startDate, endDate, status } = req.body;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Semester ID is required' });
        const dataToUpdate: any = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (startDate !== undefined) dataToUpdate.startDate = new Date(startDate);
        if (endDate !== undefined) dataToUpdate.endDate = new Date(endDate);
        if (status !== undefined) dataToUpdate.status = status;
        const semester = await prisma.semester.update({ where: { id }, data: dataToUpdate });
        return res.status(200).json(semester);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Semester ID is required' });
        await prisma.semester.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // ---- STAFF ----
    if (route === 'staff') {
      if (req.method === 'GET') {
        const { role } = req.query;
        const staff = await prisma.user.findMany({ where: { role: role ? String(role) : { in: ['faculty', 'staff'] } }, orderBy: { createdAt: 'desc' } });
        return res.status(200).json(staff);
      }
      if (req.method === 'POST') {
        const { name, email, phone, role, department } = req.body;
        const newStaff = await prisma.user.create({ data: { name, email, phone, role: role || 'faculty', department } });
        return res.status(201).json(newStaff);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const updatedStaff = await prisma.user.update({ where: { id: String(id) }, data: req.body });
        return res.status(200).json(updatedStaff);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        await prisma.user.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- STUDENTS ----
    if (route === 'students') {
      if (req.method === 'GET') {
        const students = await prisma.student.findMany({ include: { course: true, batch: true }, orderBy: { joinedAt: 'desc' } });
        return res.status(200).json(students);
      }
      if (req.method === 'POST') {
        const { firstName, lastName, email, phone, courseId, batchId, status, profilePic } = req.body;
        const newStudent = await prisma.student.create({ data: { firstName, lastName, email, phone, courseId, batchId, profilePic, status: status || 'active' }, include: { course: true, batch: true } });
        return res.status(201).json(newStudent);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const updatedStudent = await prisma.student.update({ where: { id: String(id) }, data: req.body, include: { course: true, batch: true } });
        return res.status(200).json(updatedStudent);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        await prisma.student.delete({ where: { id: String(id) } });
        return res.status(204).end();
      }
    }

    // ---- SUBJECTS ----
    if (route === 'subjects') {
      if (req.method === 'GET') {
        const subjects = await prisma.subject.findMany({ include: { course: true }, orderBy: { semester: 'asc' } });
        subjects.sort((a, b) => (a.course?.name || '').localeCompare(b.course?.name || ''));
        return res.status(200).json(subjects);
      }
      if (req.method === 'POST') {
        const { courseId, code, name, semester, credits, type } = req.body;
        if (!courseId || !code || !name || !semester) return res.status(400).json({ error: 'Missing required fields' });
        const subject = await prisma.subject.create({ data: { courseId, code, name, semester: parseInt(semester), credits: parseInt(credits) || 3, type: type || 'core' } });
        return res.status(201).json(subject);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Subject ID is required' });
        await prisma.subject.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // ---- SYLLABUS ----
    if (route === 'syllabus') {
      if (req.method === 'GET') {
        const { subjectId } = req.query;
        const whereClause = subjectId ? { subjectId: String(subjectId) } : {};
        const syllabuses = await prisma.syllabus.findMany({ where: whereClause, include: { subject: true }, orderBy: { createdAt: 'desc' } });
        return res.status(200).json(syllabuses);
      }
      if (req.method === 'POST') {
        const { subjectId, title, description, topics } = req.body;
        if (!subjectId || !title || !topics) return res.status(400).json({ error: 'Missing required fields' });
        const syllabus = await prisma.syllabus.create({ data: { subjectId, title, description, topics } });
        return res.status(201).json(syllabus);
      }
      if (req.method === 'PUT') {
        const { id } = req.query;
        const { title, description, topics } = req.body;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Syllabus ID is required' });
        const dataToUpdate: any = {};
        if (title !== undefined) dataToUpdate.title = title;
        if (description !== undefined) dataToUpdate.description = description;
        if (topics !== undefined) dataToUpdate.topics = topics;
        const syllabus = await prisma.syllabus.update({ where: { id }, data: dataToUpdate });
        return res.status(200).json(syllabus);
      }
      if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Syllabus ID is required' });
        await prisma.syllabus.delete({ where: { id } });
        return res.status(200).json({ success: true });
      }
    }

    // ---- TICKETS ----
    if (route === 'tickets') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
      return res.json(tickets);
    }

    // ---- TIMETABLE ----
    if (route === 'timetable') {
      if (req.method === 'GET') {
        const entries = await prisma.timetableEntry.findMany({ orderBy: [{ day: 'asc' }, { time: 'asc' }] });
        return res.status(200).json(entries);
      }
      if (req.method === 'POST') {
        const { day, time, subject, faculty, room, course } = req.body;
        const newEntry = await prisma.timetableEntry.create({ data: { day, time, subject, faculty, room, course } });
        return res.status(201).json(newEntry);
      }
      if (req.method === 'DELETE') {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        await prisma.timetableEntry.delete({ where: { id } });
        return res.status(204).end();
      }
    }

    // ---- TRANSPORT ----
    if (route === 'transport') {
      const url = req.url || '';
      if (url.includes('/routes')) {
        if (req.method === 'GET') {
          const routes = await prisma.transportRoute.findMany({ include: { vehicle: true }, orderBy: { routeNo: 'asc' } });
          return res.status(200).json(routes.map(r => ({ id: r.id, no: r.routeNo, name: r.name, path: r.path, vehicle: r.vehicle ? r.vehicle.vehicleId : 'Unassigned', stops: r.stops })));
        }
        if (req.method === 'POST') {
          const { routeNo, name, path, vehicleId, stops } = req.body;
          const newRoute = await prisma.transportRoute.create({ data: { routeNo, name, path, vehicleId: vehicleId || null, stops: parseInt(stops) } });
          return res.status(201).json(newRoute);
        }
      }
      if (url.includes('/vehicles')) {
        if (req.method === 'GET') {
          const vehicles = await prisma.transportVehicle.findMany({ orderBy: { vehicleId: 'asc' } });
          return res.status(200).json(vehicles.map(v => ({ id: v.vehicleId, type: v.type, plate: v.plateNumber, condition: v.condition, status: v.status })));
        }
        if (req.method === 'POST') {
          const { vehicleId, type, plateNumber, condition, status } = req.body;
          const newVehicle = await prisma.transportVehicle.create({ data: { vehicleId, type, plateNumber, condition, status: status || 'Active' } });
          return res.status(201).json(newVehicle);
        }
      }
    }

    // ---- UPLOAD ----
    if (route === 'upload') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: 'No image provided in request body.' });
      const result = await cloudinary.uploader.upload(image, { folder: 'education_app', resource_type: 'auto' });
      return res.status(200).json({ url: result.secure_url, message: 'Image uploaded successfully' });
    }

    // ---- HEALTH ----
    if (route === 'health' || route === '') {
      return res.json({ status: 'ok', message: 'Education API is running' });
    }

    return res.status(404).json({ error: `Route /api/${route} not found` });

  } catch (error: any) {
    console.error(`API Error [${route}]:`, error);
    if (error.code === 'P2002') return res.status(400).json({ error: 'A record with this value already exists' });
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
