# Smart Leads Dashboard - API Documentation

## 1. Introduction
This document provides comprehensive technical documentation for the RESTful API powering the Smart Leads Dashboard. The API is built using Node.js, Express.js, and TypeScript, with MongoDB as the database.

## 2. Base URL
All API requests are made to the following base URL:
`http://localhost:5000/api`

## 3. Authentication System
The API uses JSON Web Tokens (JWT) for authentication. For protected routes, clients must include the token in the HTTP Authorization header.
**Header Format:** `Authorization: Bearer <JWT_TOKEN>`

### 3.1 User Registration
Create a new user account in the system.
- **URL:** `/auth/register`
- **Method:** `POST`
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "name": "User Full Name",
    "email": "user@example.com",
    "password": "securePassword123",
    "role": "Sales User"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "6a0b23...",
    "name": "User Full Name",
    "email": "user@example.com",
    "role": "Sales User"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the email is already registered or validation fails.

### 3.2 User Login
Authenticate user credentials and receive a JWT access token.
- **URL:** `/auth/login`
- **Method:** `POST`
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "6a0b23...",
      "name": "User Full Name",
      "email": "user@example.com",
      "role": "Admin"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If credentials are invalid.

---

## 4. Leads Management
All endpoints in this section require a valid JWT token in the Authorization header.

### 4.1 Get All Leads
Retrieve a list of leads with support for filtering, search, and pagination.
- **URL:** `/leads`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Query Parameters:**
  - `page` (Integer): Page number for pagination. Default: 1.
  - `limit` (Integer): Number of records per page. Default: 10.
  - `status` (String): Filter by status (`New`, `Contacted`, `Qualified`, `Lost`).
  - `source` (String): Filter by source (`Website`, `Instagram`, `Referral`).
  - `search` (String): Search string matching name or email.
  - `sort` (String): Sort order (`latest` or `oldest`).
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "_id": "6a0b23...",
        "name": "Lead Name",
        "email": "lead@example.com",
        "status": "New",
        "source": "Website",
        "createdAt": "2026-05-18T14:34:03.006Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
  ```

### 4.2 Create Lead
Add a new lead to the database.
- **URL:** `/leads`
- **Method:** `POST`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "Lead Name",
    "email": "lead@example.com",
    "status": "New",
    "source": "Website"
  }
  ```
- **Response (201 Created):** Returns the created lead object.

### 4.3 Get Single Lead
Retrieve details of a specific lead by ID.
- **URL:** `/leads/:id`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Response (200 OK):** Returns the lead object.
- **Error Responses:**
  - `404 Not Found`: If the lead ID does not exist.

### 4.4 Update Lead
Modify an existing lead.
- **URL:** `/leads/:id`
- **Method:** `PUT`
- **Authentication Required:** Yes
- **Role Permissions:**
  - `Sales User`: Can only update the `status` field.
  - `Admin`: Can update all fields.
- **Request Body:** Partial update object containing fields to be modified.
- **Response (200 OK):** Returns the updated lead object.

### 4.5 Delete Lead
Remove a lead from the system.
- **URL:** `/leads/:id`
- **Method:** `DELETE`
- **Authentication Required:** Yes
- **Response (200 OK):** Confirmation of deletion.

---

## 5. Analytics and Utilities
All endpoints in this section require a valid JWT token in the Authorization header.

### 5.1 Get Lead Statistics
Retrieve summary counts of leads grouped by status.
- **URL:** `/leads/stats`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Response (200 OK):**
  ```json
  {
    "total": 100,
    "New": 25,
    "Contacted": 35,
    "Qualified": 30,
    "Lost": 10
  }
  ```

### 5.2 Get Lead Growth Data
Retrieve time-series data representing lead acquisition growth.
- **URL:** `/leads/growth`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Response (200 OK):** Returns an array of objects containing period and count.

### 5.3 Export Leads to CSV
Download leads data in CSV format based on active filters.
- **URL:** `/leads/export`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Query Parameters:** Supports the same filtering parameters as `Get All Leads`.
- **Response (200 OK):** File stream with `Content-Type: text/csv`.
