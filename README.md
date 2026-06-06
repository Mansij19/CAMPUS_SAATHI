# CampusSathi

CampusSathi is a MERN stack AI-powered multilingual campus helpdesk for students and administrators.

## Implemented modules

- Authentication and user management with JWT, bcrypt, profile updates, language preference, and role-based access control.
- Student and admin dashboards with profile cards, quick actions, recent chats, user stats, registrations, and AI query metrics.
- AI multilingual helpdesk chatbot with chat history, Gemini primary integration, Featherless fallback integration, Hindi and English support, typing indicator, and auto-scroll.

## Structure

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
  routes/
  services/
```

## Environment setup

Copy the examples and fill in real secrets:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Required backend values:

- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `FEATHERLESS_API_KEY` for fallback
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` to seed the first admin
- `MAIL_API_KEY`, `MAIL_PROVIDER`, `MAIL_FROM_EMAIL`, and provider settings for successful-login email notifications

For mail, set `MAIL_PROVIDER=resend`, `MAIL_PROVIDER=sendgrid`, or keep `MAIL_PROVIDER=generic` and provide `MAIL_API_URL`.

## Run locally

```bash
npm run install:all
npm run seed:admin
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## API summary

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

Chat:

- `POST /api/chat`
- `GET /api/chat/history`
- `DELETE /api/chat/history`

Dashboards:

- `GET /api/dashboard/student`
- `GET /api/dashboard/admin`

## Deployment notes

Backend:

- Deploy `backend/` to Render, Railway, Fly.io, or another Node host.
- Set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `GEMINI_API_KEY`, and optional Featherless values.
- Run `npm install --omit=dev` and `npm start`.

Frontend:

- Deploy `frontend/` to Vercel, Netlify, or static hosting.
- Set `VITE_API_URL` to the deployed backend API URL ending in `/api`.
- Run `npm run build` and publish `frontend/dist`.
