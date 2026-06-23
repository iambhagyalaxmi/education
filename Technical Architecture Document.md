## **Technical Architecture Document** 

## **Education Customer Support Chatbot** 

## **Overview** 

The Education Customer Support Chatbot is an AI-powered support platform that provides instant student assistance, automated ticket creation, and 24/7 customer support. 

## **Technology Stack** 

## **Frontend Layer** 

- React.js 

- Tailwind CSS 

- React Query 

- Axios 

- Google OAuth 

- Vercel Hosting 

## **Backend Layer** 

- Node.js • Express.js 

- JWT Authentication 

- REST APIs 

- WebSocket 

## **Database Layer** 

- Neon PostgreSQL • Prisma ORM 

## **AI Layer** 

- Gemini 3.1 Pro (High) 

- Prompt Engineering 

- Intent Classification 

- Context Management 

## **Monitoring** 

- Vercel Analytics 

- Sentry 

- Winston Logger 

1 

## **System Architecture** 

User Browser 

↓ 

React Chat Widget 

## ↓ 

API Gateway 

## ↓ 

Node.js Backend 

## ↓ 

AI Service Layer 

## ↓ 

Gemini 3.1 Pro 

## ↓ 

PostgreSQL Database 

↓ 

Ticket Management System 

## **Frontend Components** 

## **Chat Module** 

Responsibilities: 

- Send Messages 

- Receive Responses 

- Show Typing Indicators 

- Display Quick Actions 

2 

## **Authentication Module** 

Responsibilities: 

- Google Login 

- Session Management 

- User Profile 

## **Ticket Dashboard** 

Responsibilities: 

- Ticket Creation 

- Ticket Tracking 

- Status Monitoring 

## **Analytics Dashboard** 

Responsibilities: 

- User Analytics 

- Ticket Analytics 

- CSAT Metrics 

## **Backend Services** 

## **Chat Service** 

Functions: 

- Message Processing 

- Intent Detection 

- Prompt Construction 

- Response Validation 

## **Ticket Service** 

Functions: 

- Create Ticket 

- Update Ticket 

- Close Ticket 

- Escalate Ticket 

3 

## **User Service** 

Functions: 

- Authentication 

- Authorization 

- Profile Management 

## **Analytics Service** 

Functions: 

- Chat Analytics 

- Ticket Metrics 

- User Activity Reports 

## **Database Architecture** 

## **Users Table** 

- id 

- name • email • google_id • role • created_at 

## **Conversations Table** 

- id 

- user_id • status 

- started_at • ended_at 

## **Messages Table** 

- id • conversation_id 

- sender 

- message 

- timestamp 

## **Tickets Table** 

- id 

- ticket_number 

- user_id 

4 

- category 

- priority 

- status 

- created_at 

## **Feedback Table** 

- id 

- conversation_id 

- rating 

- comments 

## **Deployment Architecture** 

Frontend 

- Vercel 

Backend 

- Vercel Functions 

Database 

- Neon PostgreSQL 

AI Provider 

• Gemini 3.1 Pro (High) 

Monitoring 

- Sentry 

- Vercel Analytics 

## **Scalability Strategy** 

- Horizontal API Scaling 

- Database Connection Pooling 

- Response Caching 

- Rate Limiting 

- Load Balancing 

5 

## **Performance Targets** 

- API Response < 500ms 

- Chat Response < 2 seconds 

- 99.9% Availability 

- 10,000 Concurrent Users 

6 

