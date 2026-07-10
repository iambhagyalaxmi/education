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

import analyticsHandler from './api/analytics';
import auditHandler from './api/audit';
import chatHandler from './api/chat';
import documentsHandler from './api/documents';
import galleryHandler from './api/gallery';
import ticketsHandler from './api/tickets';
import studentsHandler from './api/students';
import coursesHandler from './api/courses';
import batchesHandler from './api/batches';
import staffHandler from './api/staff';
import hostelHandler from './api/hostel';
import transportHandler from './api/transport';
import hrHandler from './api/hr';
import admissionsHandler from './api/admissions';
import feesHandler from './api/fees';
import examinationsHandler from './api/examinations';
import libraryHandler from './api/library';
import departmentsHandler from './api/departments';
import timetableHandler from './api/timetable';
import materialsHandler from './api/materials';
import subjectsHandler from './api/subjects';
import syllabusHandler from './api/syllabus';
import semestersHandler from './api/semesters';
import classroomsHandler from './api/classrooms';
import gradingHandler from './api/grading';
import announcementsHandler from './api/announcements';
import messagesHandler from './api/messages';
import internalChatHandler from './api/internalChat';
import lessonPlansHandler from './api/lessonPlans';

app.use('/api/auth', authRoutes); // Keep legacy auth

// Map Vercel serverless functions to Express routes
app.all('/api/lesson-plans', lessonPlansHandler as any);
app.all('/api/analytics', analyticsHandler as any);
app.all('/api/audit', auditHandler as any);
app.all('/api/chat', chatHandler as any);
app.all('/api/documents', documentsHandler as any);
app.all('/api/gallery', galleryHandler as any);
app.all('/api/tickets', ticketsHandler as any);
app.all('/api/students', studentsHandler as any);
app.all('/api/courses', coursesHandler as any);
app.all('/api/subjects', subjectsHandler as any);
app.all('/api/syllabus', syllabusHandler as any);
app.all('/api/semesters', semestersHandler as any);
app.all('/api/classrooms', classroomsHandler as any);
app.all('/api/grading', gradingHandler as any);
app.all('/api/announcements', announcementsHandler as any);
app.all('/api/messages', messagesHandler as any);
app.all('/api/internal-chat', internalChatHandler as any);
app.use('/api/hostel', hostelHandler as any);
app.all('/api/batches', batchesHandler as any);
app.all('/api/staff', staffHandler as any);
app.use('/api/transport', transportHandler as any);
app.use('/api/hr', hrHandler as any);
app.all('/api/admissions', admissionsHandler as any);
app.all('/api/fees', feesHandler as any);
app.all('/api/examinations', examinationsHandler as any);
app.all('/api/library', libraryHandler as any);
app.all('/api/departments', departmentsHandler as any);
app.all('/api/timetable', timetableHandler as any);
app.all('/api/materials', materialsHandler as any);

import uploadHandler from './api/upload';
app.all('/api/upload', uploadHandler as any);

// For local development or non-Vercel deployments, serve the frontend
import path from 'path';

const publicPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(publicPath));

app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
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
