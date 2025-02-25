# Invention Success Prediction API

This repository contains two main components:
1. **Server-side API**: Built with Node.js and Express, handling user authentication, invention submissions, and engagement tracking.
2. **ML Model**: A machine learning model used for predicting the success of an invention based on provided parameters.

---

## 1. Server-side API

This API allows users to register, authenticate, and interact with inventions. It supports adding inventions, updating engagement metrics, and authenticating users using JWT tokens.

### Base URL: `http://localhost:3000`

### **Endpoints**

#### **1. User Registration**
**Endpoint:** `POST /test/auth/register`

**Request:**
json
{
  "username": "sourabh_pandey",
  "password": "pass123"
}


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

## 2. ML Model

The `ml-model` directory contains a machine learning model designed to predict the success of an invention based on various features. The model is built using Python and is intended for integration with the main API.

### **How It Works**
1. **Input:** The model takes features such as invention category, engagement metrics, and user activity.
2. **Processing:** It runs the input data through a pre-trained machine learning model.
3. **Output:** The model returns a success probability score for the given invention.

### **Running the ML Model Locally**

#### **1. Install Dependencies**
Navigate to the `ml-model` directory and install required packages:
```sh
cd ml-model
pip install -r requirements.txt
```

#### **2. Run the Model**
Execute the model script to make predictions:
```sh
python predict.py --input sample_data.json
```

#### **3. Sample Input (sample_data.json)**
```json
{
  "title": "Smart Solar Panel",
  "category": "Energy",
  "tags": ["solar", "renewable", "smart-tech"],
  "likes": 100,
  "comments": 10,
  "views": 500
}
```

#### **4. Sample Output**
```json
{
  "success_probability": 0.85,
  "message": "High chance of success."
}
```

### **Integration with the API**
The ML model can be integrated into the server-side API to evaluate inventions dynamically. The server can send invention data to the ML model, process the result, and return predictions to the user.

---

## Notes
- Authentication is required for submitting and updating inventions.
- JWT Tokens expire 1 hour after login.
- The ML model is still in its experimental phase and will be improved over time.

---

