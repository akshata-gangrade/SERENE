<div align="center">

# 🌿 SERENE
### AI-Powered Mental Wellness Platform

*A safe and calming digital space for self-reflection, emotional expression, and mindfulness.*

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20MongoDB-informational?style=flat-square)
![AI](https://img.shields.io/badge/AI-Groq%20API-orange?style=flat-square)

</div>

---

## 📖 Overview

SERENE is a full-stack mental wellness platform that combines AI-powered conversations, digital journaling, mood tracking, and guided breathing exercises to help users better understand and manage their emotional well-being. Built with a focus on empathy, accessibility, and thoughtful design.

---

## ✨ Features

### 👤 User Features
| Feature | Description |
|--------|-------------|
| 🔐 Secure Authentication | JWT-based login and session management |
| 🏠 Personalized Dashboard | Tailored home view with user-specific insights |
| 🤖 AI Companion Chat | Empathetic, real-time AI conversations powered by Groq |
| 💬 Conversation History | Save, revisit, and delete past conversations |
| 📝 AI-Generated Chat Titles | Automatic intelligent titling of sessions |
| 📔 Digital Journal | Create, edit, and delete personal journal entries |
| 🎯 Mood-Based Prompts | Writing prompts tailored to your current mood |
| 📅 Mood Calendar | Visual tracking of emotional patterns over time |
| 🌬️ Guided Breathing | Interactive breathing exercises for in-the-moment calm |
| 👋 Personalized Greetings | Warm, context-aware greetings on each visit |

### 🛡️ Admin Features
| Feature | Description |
|--------|-------------|
| 🔑 Admin Authentication | Secure, role-protected admin access |
| 📊 User Analytics | Insights into user engagement and growth |
| 📓 Journal Analytics | Aggregated journaling trends and patterns |
| 😊 Mood Statistics | Platform-wide mood distribution and trends |
| 📈 Platform Activity | Real-time activity insights and platform health |

---

## 🏗️ System Architecture

```
┌─────────────────────────┐
│   Frontend (React + Vite) │
└──────────┬──────────────┘
           │ HTTP / REST
┌──────────▼──────────────┐
│   Backend API (FastAPI)   │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│      MongoDB Atlas        │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│   Groq AI Integration     │
└─────────────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend**
- React, Vite, JavaScript, CSS
- Context API for state management

**Backend**
- FastAPI (Python)
- Motor (async MongoDB driver)
- Pydantic (data validation)

**Database**
- MongoDB Atlas

**Authentication**
- JWT (JSON Web Tokens)

**AI Integration**
- Groq API

**Dev Tools**
- Git & GitHub, Postman, VS Code

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB Atlas account
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/akshata-gangrade/SERENE.git
cd SERENE
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Backend runs at: `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```


---

## 📁 Project Structure

```
SERENE/
│
├── backend/
│   ├── app/
│   │   ├── middleware/       # Auth & request middleware
│   │   ├── models/           # MongoDB document models
│   │   ├── routes/           # API route handlers
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic layer
│   │   └── utils/            # Helper functions
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/           # Static assets
│       ├── components/       # Reusable UI components
│       ├── context/          # Global state (Context API)
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page-level components
│       ├── services/         # API call logic
│       ├── styles/           # Global & component CSS
│       └── utils/            # Frontend utilities
│   └── package.json
│
└── README.md
```

---

## 🔭 Roadmap

- [ ] Mobile-first Optimization
- [ ] Password Reset via Email
- [ ] Email Verification on Signup
- [ ] AI-Based Mood Insights & Pattern Detection
- [ ] Advanced Analytics Dashboard
- [ ] Daily Wellness Recommendations
- [ ] Push Notifications

---

## 🎓 Learning Outcomes

Building SERENE provided hands-on experience across the full software development lifecycle:

- Full-Stack Development (React + FastAPI)
- RESTful API Design & Integration
- Authentication & Authorization (JWT)
- Database Modeling with MongoDB
- State Management with Context API
- AI API Integration (Groq)
- UI/UX Design for wellness-focused applications
- Version Control best practices with Git & GitHub

---

## 👩‍💻 Author

**Akshata Gangrade**  
B.Tech – Computer Science & Engineering

Passionate about building meaningful software solutions that bring together technology, design, and human well-being.

[![GitHub](https://img.shields.io/badge/GitHub-akshata--gangrade-181717?style=flat-square&logo=github)](https://github.com/akshata-gangrade)

---

## ⭐ Support

If you found this project helpful or interesting, consider giving it a star on GitHub — it helps more people discover it!

---

<div align="center">
  Made with 💚 for mental wellness
</div>
