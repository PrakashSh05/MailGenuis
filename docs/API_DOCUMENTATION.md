# 📡 API Documentation

This document provides a comprehensive reference for the AI Email Generator REST API.

All endpoints prefixed with `/api/v1` expect and return JSON payloads.

---

## Standard Response Format

All responses follow a standard envelope pattern:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": null,
  "timestamp": "2024-06-25T10:00:00Z"
}
```

---

## 🔐 1. Authentication (`/api/v1/auth`)

### 1.1 Register User
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Creates a new user account and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "fullName": "Jane Doe"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "expiresIn": 86400000
  }
}
```

### 1.2 Login User
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticates an existing user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Success Response (200 OK):** *(Same as Register)*

---

## 📧 2. Emails (`/api/v1/emails`)

All endpoints in this group require a valid `Bearer <Token>`.

### 2.1 Generate Email
- **URL**: `/api/v1/emails/generate`
- **Method**: `POST`
- **Description**: Uses Google Gemini AI to generate an email based on the provided parameters.

**Request Body:**
```json
{
  "purpose": "Request a performance review meeting",
  "recipient": "manager@company.com",
  "tone": "PROFESSIONAL",
  "length": "MEDIUM",
  "language": "ENGLISH",
  "additionalInstructions": "Mention that Q2 goals were met."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subject": "Request for Performance Review Meeting",
    "body": "Dear Manager,\n\nI hope this email finds you well...\n\nBest regards,\nJane Doe",
    "generationTimeMs": 1450
  }
}
```

### 2.2 Apply AI Action
- **URL**: `/api/v1/emails/action`
- **Method**: `POST`
- **Description**: Modifies an existing email draft using a specific AI action.

**Request Body:**
```json
{
  "currentSubject": "Meeting",
  "currentBody": "Let's meet tomorrow.",
  "actionType": "EXPAND",
  "targetLanguage": "ENGLISH"
}
```

### 2.3 Save Email
- **URL**: `/api/v1/emails`
- **Method**: `POST`
- **Description**: Saves a generated email to the user's history.

**Request Body:**
```json
{
  "subject": "Final Subject",
  "body": "Final body content",
  "purpose": "Meeting",
  "tone": "PROFESSIONAL",
  "length": "SHORT",
  "language": "ENGLISH"
}
```

### 2.4 Get Email History
- **URL**: `/api/v1/emails`
- **Method**: `GET`
- **Query Params**:
  - `page` (default: 0)
  - `size` (default: 10)
  - `sortBy` (default: createdAt)
  - `query` (optional text search)
  - `isFavorite` (optional boolean filter)

### 2.5 Toggle Favorite
- **URL**: `/api/v1/emails/{id}/favorite`
- **Method**: `PATCH`

**Request Body:**
```json
{ "isFavorite": true }
```

---

## 📋 3. Templates (`/api/v1/templates`)

### 3.1 Get System Prompt Library
- **URL**: `/api/v1/templates/library`
- **Method**: `GET`
- **Auth Required**: Yes

### 3.2 Create Custom Template
- **URL**: `/api/v1/templates`
- **Method**: `POST`

**Request Body:**
```json
{
  "name": "Weekly Update",
  "tone": "PROFESSIONAL",
  "promptTemplate": "Write a weekly update mentioning blockers and achievements."
}
```

### 3.3 Get Custom Templates (Paginated)
- **URL**: `/api/v1/templates`
- **Method**: `GET`

---

## 📊 4. Dashboard (`/api/v1/dashboard`)

### 4.1 Get Dashboard Summary
- **URL**: `/api/v1/dashboard`
- **Method**: `GET`
- **Description**: Returns statistics, analytics, and recent activity in a single payload.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "statistics": [
      { "title": "Total Emails", "value": "12", "trend": "+2" }
    ],
    "analytics": {
      "mostUsedTone": "PROFESSIONAL",
      "mostUsedLanguage": "ENGLISH"
    },
    "recentActivities": [
      { "type": "EMAIL_GENERATED", "title": "Email Generated", "timestamp": "2024-06-25T10:00:00Z" }
    ]
  }
}
```

---

## 👤 5. Profile & Settings (`/api/v1/profile`)

### 5.1 Update Settings
- **URL**: `/api/v1/profile/settings`
- **Method**: `PUT`

**Request Body:**
```json
{
  "defaultTone": "FRIENDLY",
  "defaultLanguage": "SPANISH",
  "defaultEmailLength": "SHORT",
  "darkModeEnabled": true,
  "themePreference": "dark"
}
```

### 5.2 Change Password
- **URL**: `/api/v1/profile/password`
- **Method**: `PUT`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123!",
  "newPassword": "newPassword456!",
  "confirmPassword": "newPassword456!"
}
```
