# Smart Leads Dashboard - API Documentation

This document provides detailed information about the API endpoints available in the Smart Leads Dashboard backend.

## Base URL
All API requests are made to: `http://localhost:5000/api` (or your mapped Docker port).

---

## 🔐 Authentication Endpoints

### 1. Register User
Create a new account.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Admin" // Optional, defaults to "Sales User"
  }
  ```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request` (If email exists or validation fails).

### 2. Login User
Authenticate and receive a JWT token.
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK` returns `{ token, user: { _id, name, email, role } }`
- **Error Response**: `401 Unauthorized` (Invalid credentials).

---

## 📋 Leads Management Endpoints
*All lead endpoints require a valid JWT token in the `Authorization` header:*
`Authorization: Bearer <your_token>`

### 3. Get All Leads
Fetch leads with support for filtering, search, and pagination.
- **URL**: `/leads`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Records per page (default: 10)
  - `status`: Filter by status (`New`, `Contacted`, `Qualified`, `Lost`)
  - `source`: Filter by source (`Website`, `Instagram`, `Referral`)
  - `search`: Search by name or email
  - `sort`: Sort order (`latest`, `oldest`)
- **Success Response**: `200 OK` returns `{ data: [...], pagination: { total, page, limit, pages } }`

### 4. Create Lead
Create a new lead.
- **URL**: `/leads`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Lead Name",
    "email": "lead@example.com",
    "status": "New",
    "source": "Website"
  }
  ```
- **Success Response**: `201 Created`

### 5. Get Single Lead
Fetch details of a specific lead.
- **URL**: `/leads/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### 6. Update Lead
Update lead details.
- **URL**: `/leads/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Note**: `Sales User` can only update the `status` field. `Admin` can update all fields.
- **Request Body**: Partial update object.
- **Success Response**: `200 OK`

### 7. Delete Lead
Remove a lead.
- **URL**: `/leads/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin only or based on your RBAC setup)
- **Success Response**: `200 OK`

---

## 📊 Analytics & Utilities

### 8. Get Lead Stats
Get total counts grouped by status for dashboard cards.
- **URL**: `/leads/stats`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK` returns `{ total, New, Contacted, Qualified, Lost }`

### 9. Get Lead Growth
Get monthly aggregated data for the growth chart.
- **URL**: `/leads/growth`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK` returns an array of monthly stats.

### 10. Export Leads
Download leads data as a CSV file. Respects current filters.
- **URL**: `/leads/export`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**: Same as `Get All Leads` (status, source, search).
- **Success Response**: `200 OK` with `Content-Type: text/csv` and file attachment.
