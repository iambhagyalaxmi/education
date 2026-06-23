## **Education Customer Support Chatbot** 

## **Product Requirements Document (PRD)** 

## **Product Vision** 

Build an AI-powered Education Customer Support Chatbot that provides instant assistance to students, parents, educators, and website visitors through intelligent conversations, automated ticket management, and 24/7 availability. 

## **Key Tags** 

- W Fast Support 

- Smart Automation 

- Omnichannel Service 

- 

- il AI Insights 

- Higher Customer Satisfaction 

## **Objectives** 

## **Business Goals** 

- Reduce support workload by 80% 

- Provide 24/7 automated assistance 

- Improve customer satisfaction 

- Automate ticket generation 

- Improve lead conversion and student engagement 

## **User Goals** 

- Get instant answers 

- Access educational information quickly 

- Submit support requests 

- Track ticket status 

- Receive personalized assistance 

## **Technology Stack** 

## **AI Layer** 

- Gemini 3.1 Pro (High) 

- Prompt Engineering 

1 

- Intent Classification 

- Context Management • Confidence Scoring 

## **Frontend** 

- React.js 

- Tailwind CSS 

- Vercel Deployment 

## **Backend** 

- Node.js 

- Express.js 

- REST API 

- WebSocket Support 

## **Database** 

- Neon DB 

- PostgreSQL 

## **Authentication** 

- Google OAuth 

## **Analytics** 

- Conversation Analytics 

- Ticket Analytics 

- User Behavior Tracking 

## **Core Features** 

## **Customer Support** 

- Instant Q&A 

- Educational Guidance 

- Admission Information 

- Course Information 

- Fee Information 

- Scholarship Information 

## **Ticket Management** 

- Ticket Creation 

- Ticket Tracking 

- Ticket Resolution 

2 

• Ticket Escalation 

## **AI Features** 

- Intent Recognition 

- Context Retention 

- Smart Responses 

- Sentiment Detection 

- AI Insights 

## **Functional Requirements** 

## **User Authentication** 

## **Login Methods** 

- Google Login 

- Secure Session Management 

## **User Profile** 

- Name 

- Email 

- Conversation History 

- Ticket History 

## **Chat System** 

## **Supported Capabilities** 

- Real-time Chat 

- Multi-turn Conversation 

- AI Suggestions 

- Typing Indicators 

- Quick Reply Buttons 

## **Workflow Design** 

## **Workflow 1: Welcome & Triage** 

## **Process** 

User Opens Chat 

↓ 

3 

Welcome Message 

## ↓ 

Identify Intent 

## ↓ 

Classify Category 

↓ 

Route Conversation 

## **Categories** 

- Admission Inquiry 

- Course Inquiry 

- Fee Inquiry 

- Scholarship Inquiry 

- Technical Support 

- General Information 

- Complaint 

## **Workflow 2: Instant Q&A Resolution** 

## **Flow** 

User Question 

↓ 

Intent Detection 

↓ 

Knowledge Search 

↓ 

Gemini Reasoning 

↓ 

Generate Response 

↓ 

4 

Response Delivered 

## **Example** 

User: "What are your admission requirements?" 

Bot: "Admission requires academic transcripts, identification documents, and completed application forms." 

## **Workflow 3: Ticket Creation Workflow** 

## **Trigger Conditions** 

- User requests human support 

- Technical issue detected 

- Unresolved conversation 

- Low confidence score 

## **Flow** 

Issue Detection 

↓ 

Collect Information 

↓ 

Generate Ticket 

↓ 

Store Ticket 

↓ 

Send Confirmation 

## **Workflow 4: Feedback Workflow** 

## **Flow** 

Conversation Ends 

↓ 

Request Feedback 

5 

↓ 

Collect Rating 

↓ 

Store Analytics 

↓ 

Generate Insights 

## **Human Escalation Rules** 

## **Escalate When** 

- AI confidence below threshold 

- Sensitive complaint detected 

- User explicitly requests human support 

- Unknown intent 

## **Escalation Message** 

"I’m unable to provide a reliable answer for this request. 

Please contact our support team: 

Email: support@educationportal.com Phone: +91-XXXXXXXXXX 

A support representative will assist you shortly." 

## **Technical Architecture** 

## **Frontend Layer** 

React Application 

- Chat Widget 

- Authentication 

- Ticket Dashboard 

- Analytics Dashboard 

↓ 

REST API 

6 

↓ 

Node.js Backend 

## **Backend Services** 

## **Chat Service** 

Responsibilities: 

- Prompt Management 

- Conversation Context 

- Intent Detection 

- Response Generation 

## **Ticket Service** 

Responsibilities: 

- Create Ticket 

- Update Ticket 

- Ticket Tracking 

- Escalation Management 

## **User Service** 

Responsibilities: 

- Google Authentication 

- User Management • Session Control 

## **AI Processing Layer** 

User Message 

## ↓ 

Intent Detection 

↓ 

Knowledge Search 

↓ 

Gemini 3.1 Pro 

7 

↓ 

Response Validation 

↓ 

Final Response 

## **Database Layer** 

Neon PostgreSQL 

Tables: 

- users 

- conversations 

- messages • tickets 

- ticket_comments 

- feedback • analytics 

## **Database Schema** 

## **Users** 

|Field|Type|
|---|---|
|id|UUID|
|name|VARCHAR|
|email|VARCHAR|
|google_id|VARCHAR|
|created_at|TIMESTAMP|



## **Conversations** 

|Field|Type|
|---|---|
|id|UUID|
|user_id|UUID|
|started_at|TIMESTAMP|



8 

|Field|Type|
|---|---|
|ended_at|TIMESTAMP|



## **Messages** 

|Field|Type|
|---|---|
|id|UUID|
|conversation_id|UUID|
|sender|VARCHAR|
|content|TEXT|
|timestamp|TIMESTAMP|



## **Tickets** 

|Field|Type|
|---|---|
|id|UUID|
|user_id|UUID|
|title|VARCHAR|
|description|TEXT|
|status|VARCHAR|
|priority|VARCHAR|
|created_at|TIMESTAMP|



## **API Design** 

## **Authentication** 

POST /api/auth/google 

GET /api/auth/profile 

## **Chat** 

POST /api/chat/message 

9 

GET /api/chat/history 

## **Tickets** 

POST /api/tickets 

GET /api/tickets 

GET /api/tickets/:id 

PUT /api/tickets/:id 

## **Feedback** 

POST /api/feedback 

GET /api/analytics 

## **Training Dataset Structure** 

## **Intent Categories** 

## **Admission Inquiry** 

Examples: 

- How do I apply? 

- What is the admission process? 

- When do admissions start? 

## **Course Inquiry** 

Examples: 

- What courses are available? 

- Do you offer online courses? 

- What is course duration? 

## **Fee Inquiry** 

Examples: 

- What is the tuition fee? 

- Are installment options available? 

10 

## **Scholarship Inquiry** 

Examples: 

- How can I apply for scholarships? 

- What scholarships are available? 

## **Technical Support** 

Examples: 

- Login issue 

- Website not working 

- Password reset 

## **AI Guardrails** 

## **Response Rules** 

Always: 

- Be polite 

- Be professional 

- Be concise 

- Be educational 

Never: 

- Guess information 

- Generate fake policies 

- Create unauthorized promises 

- Share private user data 

## **Security Requirements** 

## **Authentication** 

- Google OAuth 

- JWT Tokens 

- Secure Sessions 

## **Data Protection** 

- HTTPS 

- Encryption at Rest 

- Encryption in Transit 

11 

## **API Security** 

- Rate Limiting 

- Input Validation 

- CSRF Protection 

- XSS Protection 

## **Legal Compliance** 

## **Privacy Requirements** 

- User Consent 

- Cookie Consent 

- Data Retention Policy 

- Account Deletion Requests 

## **Compliance** 

- GDPR Principles 

- FERPA-Aware Student Data Handling 

- Audit Logging 

## **Analytics Dashboard** 

## **Metrics** 

- Total Conversations 

- Active Users 

- Ticket Volume 

- Resolution Rate 

- Average Response Time 

- Customer Satisfaction Score 

- Escalation Rate 

- AI Accuracy Score 

## **Deployment Architecture** 

## **Hosting** 

Frontend: Vercel 

Backend: Vercel Serverless Functions 

12 

Database: Neon PostgreSQL 

AI: Gemini 3.1 Pro (High) 

Monitoring: Sentry Vercel Analytics 

## **Success KPIs** 

- 95% Uptime 

- < 2 Second Response Time 

- 80% Automated Resolution Rate 

- 90% Customer Satisfaction 

- 30% Reduction in Support Costs 

## **Future Enhancements** 

- Voice Chat 

- WhatsApp Integration 

- Telegram Integration 

- Multilingual Support 

- Admin Knowledge Base Editor 

- AI-powered Ticket Prioritization 

- Predictive Student Support 

13 

