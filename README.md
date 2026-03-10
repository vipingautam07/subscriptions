# Subscription Tracker

A production-grade, full-stack SaaS application designed to help users relentlessly track, manage, and optimize their recurring subscriptions. Features a seamless neo-brutalist UI, advanced analytics, timezone-safe auto-renewals, and automated email reminders powered by background workflows.

---

## Key Features

### Frontend (Client)
- **Modern UI**: Beautiful, fully responsive design using **React** and **Tailwind CSS**.
- **Dynamic Analytics Dashboard**: Visualizes your spending habits using **Recharts**. Includes 30-day forecasts, top expenses, and AI-driven "Smart Insights" summarizing unused/cancelled subscriptions.
- **Robust State Management**: Built with **React Query** for caching, synchronised server state, and optimistic updates.
- **Global Preferences**: User-configurable currencies (USD, EUR, GBP, INR) automatically reflect across all charts and metrics.
- **Dark Mode Support**: Seamless toggle between Light and Dark themes.

### Backend (Server)
- **Node.js & Express**: Fast, scalable REST API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database with strict schema validation and advanced lifecycle hooks.
- **Smart Subscription Engine**: Automatically rolls active subscriptions forward based on their billing cycles (Daily, Weekly, Monthly, Yearly) using `dayjs` timezone-safe calculations.
- **Automated Workflows**: Integrates with **Upstash QStash** to queue and dispatch timely email reminders to users before their subscriptions actually renew.
- **Security First**: Protected with **Arcjet** for intelligent rate limiting and bot protection, plus **JWT** based HTTP-only authentication.

---

## Tech Stack

**Client:**
- React (Vite)
- Tailwind CSS
- React Query (TanStack)
- Recharts (Data Visualization)
- Lucide React (Icons)
- React Router DOM

**Server:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Upstash Workflow (Background Jobs)
- Arcjet (Security)
- Nodemailer (Email Delivery)
- Day.js (Date & Timezone Handling)

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd subscription-tracker
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

You will need to create `.env.development.local` / `.env` files in both the `client` and `server` directories.

**Server (`server/.env`):**
```env
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

**Client (`client/.env.local`):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Running the Application

Open two terminal windows/tabs.

**1. Start the Backend Server:**
```bash
cd server
npm run dev
```

**2. Start the Frontend Client:**
```bash
cd client
npm run dev
```

The app should now be running! Open your browser and navigate to `http://localhost:5173`.

---

## Core Architecture & Lifecycle
Instead of rigidly marking subscriptions as "expired" when their billing date passes, this platform implements a realistic SaaS lifecycle. 

- **Active**: Renewing normally. The backend automatically advances the `renewalDate` forward by the billing frequency.
- **Cancelled**: The user has stopped the auto-renew. The subscription remains active until the final billing date, after which it permanently degrades to **Ended**.
- **Paused**: Temporarily halted. Billing cycle dates freeze.
- **Ended (Inactive)**: The lifecycle is complete. The application tracks this as "savings" in the dashboard insights.

---

## License
This project is licensed under the MIT License.
