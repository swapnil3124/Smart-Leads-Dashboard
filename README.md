# Smart Leads Dashboard

A premium, production-ready SaaS Lead Management Dashboard built with the MERN stack (React, Node.js, Express, MongoDB) and fully typed with TypeScript. This project was developed as a technical assessment and includes advanced features like real-time charts, server-side pagination, debounced search, and a stunning dark mode.

## 🚀 Features

### Core Functionalities
- **Authentication System**: Secure JWT-based auth with registration, login, and protected routes. Passwords hashed using Bcrypt.
- **Leads Management (CRUD)**: Complete Create, Read, Update, and Delete operations for leads.
- **Advanced Filtering & Search**: Multi-filter support (Status, Source) combined with search and sort (Latest/Oldest).
- **Server-Side Pagination**: Efficient data loading with a limit of 10 records per page handled by the backend.

### Premium UI/UX & Polish
- **Stunning Dark Mode**: Class-based dark mode with smooth color transitions.
- **Data Visualization**: Interactive charts showing leads growth over time and leads distribution by source (Pie Chart).
- **Skeleton Loaders**: Premium loading experience instead of boring loading spinners.
- **Toast Notifications**: Elegant, animated notifications using `sonner`.

### Mandatory Advanced Features
- **Debounced Search**: Optimized API calls on search inputs.
- **CSV Export**: Export filtered leads data to a clean CSV file with formatted dates.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` and `Sales User`.
- **Request Validation**: Strict backend input validation using `Zod`.

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS v4, Framer Motion, Recharts, Lucide React, Sonner.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, Zod, Express-Rate-Limit.
- **Database**: MongoDB Atlas (Cloud).
- **DevOps**: Docker & Docker Compose.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Docker (Optional, for containerized setup)

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/swapnil3124/Smart-Leads-Dashboard.git
   cd Smart-Leads-Dashboard
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   ```
   Run the backend in development mode:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The app will be running at `http://localhost:5173`.

### 🐳 Running with Docker

You can run the entire stack using Docker Compose:

1. Ensure your `docker-compose.yml` has the correct `MONGO_URI`.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
   The frontend will be accessible at `http://localhost:80`.

## 🔒 Security Features
- **Rate Limiting**: Prevents brute-force attacks on login and spamming on API endpoints.
- **Input Validation**: Stops malicious or malformed data at the API level using Zod.
- **JWT Protection**: Secured endpoints ensuring only authenticated users with proper roles can access data.

## 📄 License
This project is developed for assessment purposes.
