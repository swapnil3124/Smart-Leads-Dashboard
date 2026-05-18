# Smart Leads Dashboard - Setup and Installation Guide

## 1. Overview
This document provides detailed, step-by-step instructions for setting up the Smart Leads Dashboard project from scratch. It covers local development environment setup as well as containerized deployment using Docker.

---

## 2. Prerequisites
Before beginning the setup process, ensure that the following software is installed on your local machine:
- **Node.js** (Version 18.0.0 or higher)
- **npm** (Usually comes with Node.js)
- **Git** (For version control)
- **Docker & Docker Compose** (Optional, required only for containerized setup)

---

## 3. Database Setup (MongoDB Atlas)
This project uses MongoDB Atlas as a cloud database provider. Follow these steps to configure your database:

### 3.1 Create a Cluster
1. Sign in to your MongoDB Atlas account.
2. Create a new project and build a free M0 cluster.
3. Choose your preferred cloud provider and region.

### 3.2 Configure Network Access (Crucial Step)
1. In the Atlas dashboard, navigate to **Network Access** under the Security section.
2. Click **Add IP Address**.
3. To allow access from anywhere (recommended for initial setup and dynamic IPs), enter `0.0.0.0/0` in the IP Address field.
4. Click **Confirm** and wait for the status to become Active.

### 3.3 Create Database User
1. Navigate to **Database Access** under the Security section.
2. Click **Add New Database User**.
3. Choose **Password** as the authentication method.
4. Enter a username and a strong password.
5. Set the built-in role to **Read and write to any database**.
6. Click **Add User**.

### 3.4 Get Connection String
1. Go back to the **Database** section.
2. Click **Connect** on your cluster.
3. Select **Connect your application** (Drivers).
4. Copy the connection string provided. It will look similar to:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<password>` with the actual password you created for the database user.

---

## 4. Local Development Setup

### 4.1 Clone the Repository
Open your terminal and run the following commands:
```bash
git clone https://github.com/swapnil3124/Smart-Leads-Dashboard.git
cd Smart-Leads-Dashboard
```

### 4.2 Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string_here
   JWT_SECRET=your_secret_key_for_jwt
   JWT_EXPIRES_IN=1d
   ```
   *Replace `your_mongodb_atlas_connection_string_here` with the connection string obtained in step 3.4.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The server should start on port 5000 and display "MongoDB Connected".

### 4.3 Frontend Configuration
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173` (or the port displayed in your terminal).

---

## 5. Containerized Setup (Docker)
If you prefer to run the entire application stack using Docker, follow these instructions.

### 5.1 Configuration
1. Open the `docker-compose.yml` file located in the root directory of the project.
2. Ensure the `MONGO_URI` environment variable under the `backend` service is set to your MongoDB Atlas connection string.

### 5.2 Execution
1. Open your terminal in the root directory of the project.
2. Run the following command to build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Once the process completes, the frontend will be accessible at `http://localhost:80` and the backend API at `http://localhost:5000`.

---

## 6. Verification and Troubleshooting
- **Database Connection Issues**: If the backend fails to connect to MongoDB, double-check that your IP address is correctly whitelisted in MongoDB Atlas (Step 3.2) and that your password does not contain special characters that require URL encoding.
- **Port Conflicts**: Ensure that ports `5000` and `5173` (or `80` for Docker) are not being used by other applications on your system.
