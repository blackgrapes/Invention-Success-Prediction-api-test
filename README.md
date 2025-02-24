This API allows users to register, authenticate, and interact with inventions. It supports adding inventions, updating engagement metrics, and authenticating users using JWT tokens.

# Base URL: http://localhost:3000

**1. User Registration**
Endpoint: POST /test/auth/register

Request:
{
  "username": "sourabh_pandey",
  "password": "pass123"
}


Response:
{
  "success": true,
  "message": "User Registered Successfully",
  "user": {
    "_id": "65abc1234de56789f0123456",
    "username": "john_doe",
    "createdAt": "2025-02-24T12:00:00.000Z",
    "updatedAt": "2025-02-24T12:00:00.000Z"
  }
}

**2. User Login**
Endpoint: POST /test/auth/login

Request:
{
  "username": "sourabh_pandey",
  "password": "pass123"
}

Response:
{
  "success": true,
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "_id": "65abc1234de56789f0123456",
    "username": "john_doe",
    "createdAt": "2025-02-24T12:00:00.000Z",
    "updatedAt": "2025-02-24T12:00:00.000Z"
  }
}

**Inventions**

**3. Submit an Invention**
Endpoint: POST /test/inventions

Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}

Request:
{
  "title": "Smart Solar Panel",
  "description": "A solar panel that adjusts its angle based on the sun’s position.",
  "category": "Energy",
  "tags": ["solar", "renewable", "smart-tech"]
}

Response:
{
  "success": true,
  "message": "Invention Submitted Successfully",
  "invention": {
    "_id": "65abc1234de56789f0123457",
    "title": "Smart Solar Panel",
    "description": "A solar panel that adjusts its angle based on the sun’s position.",
    "category": "Energy",
    "tags": ["solar", "renewable", "smart-tech"],
    "engagement": {
      "likes": 0,
      "comments": 0,
      "views": 0
    },
    "createdAt": "2025-02-24T12:00:00.000Z",
    "updatedAt": "2025-02-24T12:00:00.000Z"
  }
}

**4. Update Engagement on an Invention**
Endpoint: PATCH /test/inventions/:id/engagement

Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}

Request:
{
  "likes": 100,
  "comments": 10,
  "views": 500
}

Response:
{
  "success": true,
  "message": "Engagement Updated Successfully",
  "invention": {
    "_id": "65abc1234de56789f0123457",
    "title": "Smart Solar Panel",
    "description": "A solar panel that adjusts its angle based on the sun’s position.",
    "category": "Energy",
    "tags": ["solar", "renewable", "smart-tech"],
    "engagement": {
      "likes": 100,
      "comments": 10,
      "views": 500
    },
    "createdAt": "2025-02-24T12:00:00.000Z",
    "updatedAt": "2025-02-24T12:10:00.000Z"
  }
}

**Authentication Middleware**
All protected routes require authentication. Users must provide a Bearer Token in the request headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
If the token is missing or invalid, the API will return:
{
  "success": false,
  "message": "Access Denied: No Token Provided"
}

or

{
  "success": false,
  "message": "Invalid or Expired Token"
}

**Database Schema**

**User Model:**
{
  "_id": "ObjectId",
  "username": "String (Unique, Required)",
  "password": "String (Hashed, Required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}

**Invention Model:**
{
  "_id": "ObjectId",
  "title": "String (Required)",
  "description": "String (Required)",
  "category": "String (Required)",
  "tags": ["Array of Strings"],
  "engagement": {
    "likes": "Number (Default: 0)",
    "comments": "Number (Default: 0)",
    "views": "Number (Default: 0)"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}

**Notes:**
Authentication is required for submitting and updating inventions.
JWT Tokens expire in 1 hour after login.

