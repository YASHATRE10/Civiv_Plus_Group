# CivicPulse - Smart City Grievance & Feedback Management Portal

CivicPulse is a full-stack complaint and feedback platform for citizens, officers, and administrators. It includes role-based workflows, assignment management, reporting APIs, and responsive dashboards.

## Project Structure

- `backend/` - Spring Boot API (JWT auth, complaints, feedback, reports)
- `frontend-angular/` - Angular app (role-based dashboards and analytics)

## Tech Stack

- Frontend: Angular, Tailwind CSS, Chart.js
- Backend: Spring Boot, Spring Security, JWT, Spring Data JPA
- Database: H2 (default local file DB), optional MySQL profile

## Local Setup

### Quick Start (Backend + Frontend Together)

From the project root on Windows:

```powershell
.\start-civicpulse.ps1
```

Optional (skip frontend dependency install check):

```powershell
.\start-civicpulse.ps1 -SkipFrontendInstall
```

This launches:
- Backend: http://localhost:8080
- Frontend: http://localhost:4200

If script execution is blocked once, run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 1. Backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

Default seeded admin:
- Email: `admin@civicpulse.com`
- Password: `Admin@123`

### 2. Frontend (Angular)

```bash
cd frontend-angular
npm install
npm run start
```

Frontend URL: `http://localhost:4200`

## Key Routes

- Admin Dashboard (assignment focused): `http://localhost:4200/admin`
- Admin Analytics: `http://localhost:4200/analytics`
- Officer Dashboard: `http://localhost:4200/officer`
- Officer Analytics: `http://localhost:4200/officer-analytics`

## Features

- JWT login and role-based routing
- Citizen complaint submission with optional image upload
- Admin officer assignment with priority/deadline updates
- Officer complaint processing (in-progress/resolved) with notes and proof upload
- Analytics and reports:
	- Complaints by category
	- Monthly trend reporting
	- SLA performance tracking
	- Red-zone heatmap for repeated complaint areas
- Multi-language UI support (English/Hindi/Marathi)
- Responsive, modern dashboard styling

## Notes

- The backend uses file-based H2 DB by default (`backend/data/civicpulse.mv.db`).
- If backend startup fails due to DB file lock, stop any existing Java process using port `8080` and restart.
