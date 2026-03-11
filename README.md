![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Docker Compose](https://img.shields.io/badge/Docker--Compose-Orchestration-blue)
![Node](https://img.shields.io/badge/Node.js-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

# Subscription Tracker

A **production-grade full-stack SaaS application** designed to help users track, manage, and optimize their recurring subscriptions.

The platform provides a modern dashboard, advanced analytics, automated renewal tracking, and intelligent reminders to prevent unnecessary spending.

Built with a **containerized architecture using Docker**, ensuring consistent environments across development and deployment.

---

# Highlights

* Production-ready **Dockerized architecture**
* Modern **React + Tailwind UI**
* **Subscription analytics dashboard**
* **Automated renewal tracking**
* **Email reminder workflows**
* Secure **JWT authentication**
* **Rate limiting and bot protection**
* **Timezone-safe billing calculations**

---

# System Architecture

The application runs using a **containerized microservice architecture**.

### Components

* **React Frontend** – User interface
* **Node.js Backend** – REST API and business logic
* **MongoDB** – Database for subscription data
* **Nginx** – Reverse proxy serving the frontend
* **Docker Compose** – Container orchestration

### Architecture Flow

User → Nginx (Docker) → React (Container) → Node API (Container) → MongoDB (Container)

---

# Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* TanStack React Query
* Recharts
* Lucide React
* React Router

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Nodemailer
* Day.js

## Infrastructure

* Docker
* Docker Compose
* Nginx
* Upstash QStash
* Arcjet Security

---

# Project Structure

```
subscription-tracker
│
├── client
│   ├── src
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── Dockerfile
│   └── server.js
│
├── docker-compose.yml
├── README.md
```

---

# Docker Setup (Recommended)

The entire application can be started using Docker.

## Prerequisites

Install:

* Docker
* Docker Compose

## Run the Application

```
docker-compose up --build
```

This will start:

* React frontend (served through Nginx)
* Node.js backend
* MongoDB database

Once the containers are running open:

```
http://localhost
```

---

# Running Without Docker (Development Mode)

You can also run the application locally without containers.

## Prerequisites

Install:

* Node.js
* MongoDB

---

## Clone the Repository

```
git clone <your-repo-url>
cd subscription-tracker
```

---

## Install Backend Dependencies

```
cd server
npm install
```

---

## Install Frontend Dependencies

```
cd ../client
npm install
```

---

# Environment Variables

Create `.env` files in both **server** and **client** directories.

## Server (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

QSTASH_TOKEN=your_upstash_qstash_token
QSTASH_URL=your_upstash_qstash_url

EMAIL_PASSWORD=your_email_password
```

---

## Client (.env.local)

```
VITE_API_URL=http://localhost:5000/api/v1
```

---

# Start Development Servers

Backend:

```
cd server
npm run dev
```

Frontend:

```
cd client
npm run dev
```

Open:

```
http://localhost:5173
```

---

# Core Subscription Lifecycle

Instead of rigidly marking subscriptions as expired when their billing date passes, the platform models a **real SaaS lifecycle**.

### Active

Subscription automatically renews according to billing frequency.

### Cancelled

Auto-renew is disabled but remains active until the final billing date.

### Paused

Billing cycle temporarily halted.

### Ended

Subscription lifecycle completed and counted as savings.

---

# Security Features

* JWT authentication with HTTP-only cookies
* Rate limiting and bot protection using Arcjet
* Password hashing with bcrypt
* Environment variable based configuration

---

# Analytics Dashboard

The dashboard provides:

* Monthly subscription cost breakdown
* Forecast of upcoming expenses
* Smart insights detecting unused subscriptions
* Currency preference support (USD, EUR, GBP, INR)

---

# Background Workflows

Using **Upstash QStash**, the system automatically:

* Schedules subscription reminders
* Sends renewal alerts
* Prevents users from missing billing dates

---

# License

This project is licensed under the **MIT License**.

---

# Author

Vipin Gautam
