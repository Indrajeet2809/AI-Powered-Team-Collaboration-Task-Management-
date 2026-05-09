# AI-Powered Team Collaboration & Task Management Platform

A full-stack SaaS-style collaboration platform inspired by tools like Jira, Trello, and Slack.

This platform allows organizations to manage teams, projects, tasks, notifications, and activity logs in a secure multi-user environment with role-based access control.

---

# 🚀 Features

## Authentication & Authorization

* JWT Authentication
* HTTP-only Cookie-based Auth
* Protected Routes
* Persistent Login Sessions
* Logout Functionality
* Role-Based Access Control

---

# 👥 Organization Management

## ORG_ADMIN / MANAGER

Can:

* Create organizations
* Add members
* Create teams
* Create projects
* Create tasks
* Assign tasks
* Manage workflows

## MEMBER

Can:

* View organizations
* View teams
* View projects
* View assigned tasks
* Update assigned task status
* Receive notifications

Cannot:

* Create organizations
* Add members
* Create teams
* Create projects
* Create tasks

---

# 📁 Project Features

## Organizations

* Create organizations
* Manage organization members
* Assign organization roles

## Teams

* Create teams inside organizations
* View teams and members

## Projects

* Create projects inside organizations
* Assign teams to projects

## Tasks

* Create tasks
* Assign tasks to members
* Update task status
* Kanban-style task workflow

### Task Status Flow

```txt
TODO → IN_PROGRESS → REVIEW → COMPLETED
```

---

# 🔔 Notifications

* Real-time task assignment notifications
* Notification center
* Mark notifications as read

---

# 📊 Dashboard

Real-time dashboard with:

* Organization count
* Team count
* Project count
* Task count
* Notifications
* Recent activities

---

# ⚡ Activity Logs

Tracks:

* Organization creation
* Team creation
* Project creation
* Task creation
* Task status updates
* Member additions

---

# 🔌 Real-Time Features

Implemented using:

* Socket.io

Features:

* Real-time notifications
* Live task assignment updates

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* Lucide React
* Socket.io Client

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Socket.io
* Cookie Parser
* BcryptJS

## Database

* PostgreSQL
* Neon PostgreSQL Cloud Database

## DevOps

* Docker
* AWS ECR

---

# 📂 Folder Structure

## Frontend

```txt
frontend/
 ├── src/
 │    ├── api/
 │    ├── components/
 │    ├── context/
 │    ├── pages/
 │    ├── routes/
 │    └── socket/
```

## Backend

```txt
backend/
 ├── prisma/
 ├── src/
 │    ├── config/
 │    ├── controllers/
 │    ├── middlewares/
 │    ├── routes/
 │    ├── services/
 │    ├── socket/
 │    └── utils/
```

---

# 🔐 Roles & Permissions

| Feature              | ORG_ADMIN | MANAGER | MEMBER |
| -------------------- | --------- | ------- | ------ |
| Create Organization  | ✅         | ✅       | ❌      |
| Add Members          | ✅         | ✅       | ❌      |
| Create Team          | ✅         | ✅       | ❌      |
| Create Project       | ✅         | ✅       | ❌      |
| Create Task          | ✅         | ✅       | ❌      |
| View Tasks           | ✅         | ✅       | ✅      |
| Update Any Task      | ✅         | ✅       | ❌      |
| Update Assigned Task | ✅         | ✅       | ✅      |

---

# 📦 Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create .env

```env
PORT=3000
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Prisma Setup

```bash
npx prisma generate
npx prisma db push
```

## Run backend

```bash
npm run dev
```

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create .env

```env
VITE_API_URL=http://localhost:3000
```

## Run frontend

```bash
npm run dev
```

---

# 🔄 API Modules

## Auth APIs

* Register
* Login
* Logout
* Get Current User

## Organization APIs

* Create Organization
* Get Organizations
* Add Members

## Team APIs

* Create Team
* Get Teams

## Project APIs

* Create Project
* Get Projects

## Task APIs

* Create Task
* Get Tasks
* Update Task Status

## Notification APIs

* Get Notifications
* Mark Notification Read

---

# 🐳 Docker Support

Docker support is planned for:

* Backend containerization
* Frontend containerization
* Docker Compose setup
* AWS ECR deployment

---

# ☁ AWS Deployment

Planned deployment:

* Docker Images
* AWS ECR
* EC2 / ECS
* Nginx Reverse Proxy

---

# 📸 Future Improvements

* Drag & Drop Kanban Board
* File Uploads
* Team Chat
* Video Meetings
* Email Notifications
* Dark Mode
* Search & Filtering
* Pagination
* Analytics Dashboard
* Calendar Integration

---

# 👨‍💻 Author

## Indrajeet Raj

Backend-focused Software Engineer passionate about:

* Backend Development
* SaaS Architecture
* System Design
* Real-Time Applications
* Scalable Systems
* DevOps & Cloud

---

# ⭐ Project Status

```txt
Currently in active development.
```

This project is being developed as an industry-level SaaS collaboration platform while learning:

* PostgreSQL
* Prisma ORM
* Docker
* AWS
* Real-Time Systems
* Role-Based Architecture
