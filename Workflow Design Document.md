## **Workflow Design Document** 

## **Education Customer Support Chatbot** 

## **Workflow 1** 

## **Welcome & Triage Workflow** 

## **Objective** 

Identify user intent and route to the appropriate support flow. 

## **Process** 

User Opens Chat 

↓ 

Welcome Message 

↓ 

Intent Detection 

↓ 

Category Classification 

↓ 

Workflow Assignment 

## **Categories** 

- Admissions 

- Courses 

- Fees 

- Scholarships 

- Technical Support 

- General Inquiry 

- Complaint 

1 

## **Workflow 2** 

## **Instant Q&A Resolution Workflow** 

## **Objective** 

Provide immediate responses using AI. 

## **Process** 

User Question 

↓ 

Intent Detection 

↓ 

Knowledge Search 

## ↓ 

Gemini Processing 

↓ 

Response Validation 

↓ 

Answer Delivered 

## **Success Criteria** 

• Response Time < 2 Seconds • Confidence > 70% 

## **Workflow 3** 

## **Live Database Lookup Workflow** 

## **Objective** 

Retrieve real-time information from PostgreSQL. 

2 

## **Example Requests** 

- Ticket Status 

- User Profile 

- Application Status 

- Enrollment Information 

## **Process** 

User Request 

↓ 

Authentication Check 

## ↓ 

Database Query 

↓ 

Result Validation 

↓ 

Response Delivered 

## **Workflow 4** 

## **Ticket Creation Workflow** 

## **Trigger Conditions** 

- User Requests Human Support 

- Low AI Confidence 

- Technical Issues 

- Unresolved Questions 

## **Process** 

Issue Identification 

↓ 

Collect Details 

↓ 

3 

Create Ticket 

↓ 

Store in PostgreSQL 

↓ 

Generate Ticket ID 

↓ 

Notify User 

## **Workflow 5** 

## **Ticket Escalation Workflow** 

## **Trigger Conditions** 

- High Priority Ticket 

- Repeated Complaint 

- Sensitive Request 

## **Process** 

Ticket Created 

↓ 

Priority Evaluation 

↓ 

Agent Assignment 

↓ 

Escalation Notification 

↓ 

Resolution Tracking 

4 

## **Workflow 6** 

## **Feedback Collection Workflow** 

## **Objective** 

Measure Customer Satisfaction. 

## **Process** 

Conversation Completed 

↓ 

Request Rating 

↓ 

Collect Feedback 

↓ 

Store Feedback 

↓ 

Generate Analytics 

## **Workflow 7** 

## **Out-of-Scope Handling Workflow** 

## **Objective** 

Prevent AI hallucinations. 

## **Process** 

Unknown Query 

↓ 

Confidence Check 

↓ 

5 

Below Threshold 

## ↓ 

Stop AI Processing 

## ↓ 

Display Contact Information 

## **Escalation Response** 

I cannot provide a reliable answer for this request. 

Please contact: 

• Support Email • Support Phone 

A support representative will assist you. 

## **Workflow 8** 

## **Authentication Workflow** 

## **Process** 

Google Login 

↓ 

OAuth Verification 

## ↓ 

JWT Generation 

↓ 

User Session Creation 

↓ 

Access Granted 

6 

## **Workflow 9** 

## **Analytics Workflow** 

## **Process** 

User Interaction 

↓ 

Event Tracking 

↓ 

Analytics Processing 

↓ 

Dashboard Reporting 

## **Metrics** 

- Total Conversations 

- Ticket Volume 

- Resolution Rate 

- Escalation Rate 

- Customer Satisfaction 

7 

