# CivicPulse - Smart City Grievance & Feedback Management Portal

A full stack civic issue reporting system with role-based workflows for citizens, officers, and administrators.

## Project Structure

- `frontend` - React (Vite) + Tailwind dashboard app
- `backend` - Spring Boot + JWT + MySQL REST API

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Backend Setup

1. Create MySQL and ensure credentials in `backend/src/main/resources/application.properties` match your environment.
2. Run backend:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

Default seeded admin user:
- Email: `admin@civicpulse.com`
- Password: `Admin@123`

## Implemented Features

- JWT authentication with role-based route access
- Citizen grievance submission with image upload
- Admin assignment, priority, deadline, and analytics dashboard charts
- Officer complaint progress and status updates
- Citizen feedback/rating and complaint reopening
- REST APIs for auth, complaints, feedback, and reports
- Responsive glassmorphism dashboard UI with Lucide icons
