# CampusSathi

CampusSathi is a full-stack, AI-powered campus helpdesk for students and administrators. It combines secure authentication, smart dashboards, AI chat support, notice and form assistance, notifications, and multilingual translation in one responsive web app.

## Why It Stands Out

- Built for real campus workflows, not just a demo
- AI chat with Gemini primary support and Featherless fallback
- Student and admin experiences are separated with role-based access
- Multilingual support for English, Hindi, Marathi, Tamil, Telugu, and Bengali
- Clean, mobile-friendly UI built with React, Vite, Tailwind, Node.js, Express, and MongoDB

## Core Features

### Student Experience

- Welcome dashboard with personalized overview
- Chat assistant access from dashboard and floating widget
- Saved conversation history
- Uploaded document tracking
- Scholarship recommendations
- Notification center with unread and read states
- Upcoming deadlines view
- Recent activity widget

### Admin Experience

- User management table
- FAQ management
- Notice management
- Scholarship management
- Analytics overview for users, conversations, notices, and forms

### Notification System

- Scholarship deadline alerts
- Exam registration reminders
- Notice announcements
- In-app notification bell and drawer
- Mark notifications as read

### Translation Engine

- Hindi to English and English to Hindi translation
- User language preference storage
- Translate chatbot responses
- Translate notice summaries
- Dynamic language selection for supported languages

### AI Assistance

- Gemini-powered chat responses
- Featherless fallback when Gemini is unavailable
- Notice summarization
- Form text extraction and analysis
- OCR-style document processing for uploaded PDFs and images

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- AI: Gemini Pro API, Featherless API fallback

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
frontend/src/
  components/
  context/
  hooks/
  pages/
  services/
```

## Key Pages

- Landing page
- Login and registration
- Student dashboard
- Admin dashboard
- Chat page
- Form assistant and form analysis pages
- Notice summarizer and history pages
- Profile page

## API Overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Chat

- `POST /api/chat`
- `GET /api/chat/history`
- `DELETE /api/chat/history`

### Dashboards

- `GET /api/dashboard/student`
- `GET /api/dashboard/admin`

### Student Activity

- `GET /api/student/activity`

### Admin Management

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/notices`
- `POST /api/admin/faqs`
- `POST /api/admin/scholarships`

### Notifications

- `POST /api/notifications`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

### Translation

- `POST /api/translate`
- `PUT /api/user/language`

## Environment Setup

Copy the example environment files and add your secrets:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend Environment

- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `FEATHERLESS_API_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `MAIL_PROVIDER`
- `MAIL_API_KEY`
- `MAIL_FROM_EMAIL`
- `MAIL_FROM_NAME`
- `CLIENT_URL`

### Frontend Environment

- `VITE_API_URL`

## Run Locally

```bash
npm run install:all
npm run seed:admin
npm run dev:backend
npm run dev:frontend
```

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/api/health`

## Deployment

### Backend

- Deploy `backend/` to Render, Railway, Fly.io, or any Node host
- Set production environment variables
- Run `npm install --omit=dev`
- Start with `npm start`

### Frontend

- Deploy `frontend/` to Vercel, Netlify, or static hosting
- Set `VITE_API_URL` to the deployed backend API URL ending in `/api`
- Run `npm run build`
- Publish `frontend/dist`

## Hackathon Summary

CampusSathi is designed to show both technical depth and user value:

- real authentication and role-based access
- practical dashboards for students and admins
- AI-powered communication and translation
- clear deployment path and production-oriented structure

