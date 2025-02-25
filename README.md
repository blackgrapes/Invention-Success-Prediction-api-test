# Invention Success Prediction API

This repository contains two main components:
1. **Server-side API**: Built with Node.js and Express, handling user authentication, invention submissions, and engagement tracking.
2. **ML Model**: A simple demonstration of a machine learning model that predicts the success of an invention based on given parameters. More complexity can be added as needed.

---

## 1. Server-side API

This API allows users to register, authenticate, and interact with inventions. It supports adding inventions, updating engagement metrics, and authenticating users using JWT tokens.

### Base URL: `http://localhost:3000`

### **Endpoints**

#### **1. User Registration**
**Endpoint:** `POST /test/auth/register`

**Request:**
```json
{
  "username": "sourabh_pandey",
  "password": "pass123"
}
```

**Response:**
```json
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
```

#### **2. User Login**
**Endpoint:** `POST /test/auth/login`

**Request:**
```json
{
  "username": "sourabh_pandey",
  "password": "pass123"
}
```

**Response:**
```json
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
```

#### **3. Submit an Invention**
**Endpoint:** `POST /test/inventions`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request:**
```json
{
  "title": "Smart Solar Panel",
  "description": "A solar panel that adjusts its angle based on the sun’s position.",
  "category": "Energy",
  "tags": ["solar", "renewable", "smart-tech"]
}
```

**Response:**
```json
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
```

#### **4. Update Engagement on an Invention**
**Endpoint:** `PATCH /test/inventions/:id/engagement`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request:**
```json
{
  "likes": 100,
  "comments": 10,
  "views": 500
}
```

**Response:**
```json
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
```
---

## Notes
- Authentication is required for submitting and updating inventions.
- JWT Tokens expire 1 hour after login.
- The ML model is in an experimental phase and can be extended with more sophisticated features.

---

## 2. ML Model

The `ML-Model` directory contains a simple demonstration of a machine learning model that predicts the success of an invention based on input features. This is a basic implementation, and additional complexity can be introduced as needed. Check the `ML-Model` directory for details on running the model and testing its capabilities.

---
