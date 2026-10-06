# LearnFlow — Production-Quality Course Learning & Quiz Platform

> **"Learn. Practice. Track your progress."**  
> A polished, modern, full-stack EdTech web application built with React, Node.js, Express, and MongoDB.

---

## 🌟 Overview

**LearnFlow** is designed to feel like a real modern EdTech product (inspired by Linear, Vercel, Notion, and Coursera) rather than a basic tutorial demo. It features an interactive course catalog, a distraction-free lesson reader, automated lesson completion tracking, timed assessment quizzes, persistent scoring with question reviews, and comprehensive analytics.

---

## ✨ Features

### 🎓 Learning Experience
- **Interactive Course Catalog**: Browse, search by title/keywords/topics, and filter by category (*Frontend, Backend, Database, AI & Data, Full-Stack*) and difficulty level (*Beginner, Intermediate, Advanced*).
- **Curriculum & Lesson Reader**: Clean typography and reader layout with sequential lesson navigation, code highlighting, and previous/next controls.
- **Granular Progress Tracking**: Real-time progress updates upon completing lessons, persistent across reloads and logins.
- **Automated Course Completion**: Automatically awards completion status when all lessons are finished.

### ⏱️ Timed Quiz Assessment Engine
- **Multiple-Choice Quizzes**: Every course features its own comprehensive assessment quiz.
- **Server-Side Validation**: Correct answers and explanations are safely kept on the server and never exposed to the client prior to submission.
- **Live Countdown Timer**: Visual warnings (*Normal*, *Warning at <60s*, *Critical pulsing at <30s*), auto-submitting if the timer reaches 00:00.
- **Interactive Question Navigator**: Jump to any question freely with clear visual indicators (*Current*, *Answered*, *Unanswered*).
- **Attempt History & Retries**: Every attempt is preserved in MongoDB; learners can retry quizzes anytime without losing past records.
- **Polished Scorecards**: Visual circular radial score percentage, pass/fail status, confetti celebration on passing, and question-by-question review with explanations.

### 📊 Dashboard & Analytics
- **Personalized Greeting**: Dynamic time-of-day greeting based on local time.
- **Key Metric Cards**: Enrolled courses, completed courses, overall learning progress percentage, and average quiz score.
- **Continue Learning Section**: Immediate access to courses currently in progress.
- **Visual Analytics**: Interactive Recharts bar visualization showing comparative course completion percentages.

### 🌓 Design & Accessibility
- **Dark Mode / Light Mode**: Beautiful dark and light themes with instant toggle in the navbar and persistent storage in `localStorage`.
- **Responsive Layout**: Designed for seamless performance across mobile (320px+), tablet, and desktop viewports.
- **Rich States**: Skeleton shimmer loaders, empty states with SVG illustrations, and helpful error screens with retry buttons.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: JavaScript (ES Modules, JSX — no TypeScript)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS with custom brand palette and dark mode
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios with interceptors
- **Celebration**: Canvas-Confetti

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **Security**: CORS headers, environment variable isolation, sanitized API payloads
- **Zero-Config Fallback**: Automatic `mongodb-memory-server` fallback if local MongoDB is not running

---

## 📁 Architecture

```
learnflow/
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── courses/       # CourseCard, LessonItem, CourseFilter
│   │   │   ├── layout/        # Navbar, Footer, Layout
│   │   │   ├── quiz/          # QuizTimer, QuizOption, QuestionNavigator, ScoreCard
│   │   │   └── ui/            # Button, Card, Badge, ProgressBar, Modal, Skeleton, EmptyState, ErrorState, Toast, Avatar
│   │   ├── pages/             # Login, Register, Dashboard, Courses, CourseDetail, LessonDetail, Quiz, QuizResult, MyProgress, NotFound
│   │   ├── routes/            # AppRoutes, ProtectedRoute
│   │   ├── services/          # api.js, authApi.js, courseApi.js, progressApi.js, quizApi.js
│   │   ├── store/             # authStore.js, themeStore.js, toastStore.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/            # db.js (MongoDB connection with smart in-memory fallback)
│   │   ├── controllers/       # authController, courseController, progressController, quizController
│   │   ├── middleware/        # authMiddleware, errorMiddleware
│   │   ├── models/            # User, Course, Progress, QuizResult
│   │   ├── routes/            # authRoutes, courseRoutes, progressRoutes, quizRoutes
│   │   ├── seeds/             # seed.js, seedData.js
│   │   ├── services/          # progressService, quizService
│   │   ├── utils/             # response, token
│   │   ├── testFlow.js        # Automated verification script
│   │   └── server.js
│   └── package.json
│
├── package.json               # Root convenience scripts
└── README.md
```

---

## 🔑 Demo Credentials

To quickly explore the application with existing progress and quiz history:

| Field | Value |
|---|---|
| **Email** | `demo@learnflow.com` |
| **Password** | `Demo@12345` |

*(Tip: On the Login page, you can click the **"Autofill"** button to fill these credentials in one click!)*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnflow
JWT_SECRET=learnflow_super_secret_jwt_key_2026_dev_prod
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Note: If no local MongoDB is running at `mongodb://localhost:27017/learnflow`, the backend will automatically spin up an in-memory MongoDB instance with zero manual setup required.)*

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Clone & Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

```bash
git clone <repository-url>
cd "Course Learning & Quiz Platform"
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo user, 6 courses, lessons, and quizzes
npm run dev      # Starts server on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Alternatively, from the project root:
```bash
# Start backend
npm run dev:backend

# Start frontend
npm run dev:frontend
```

Now open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Login with credentials, returns JWT token & user
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Get current logged-in user profile (*Private*)

### Courses (`/api/courses`)
- `GET /api/courses` — List all courses with search, category, and difficulty filters
- `GET /api/courses/:idOrSlug` — Get course details by slug or ObjectId
- `GET /api/courses/:idOrSlug/lessons` — Get curriculum lessons list
- `GET /api/courses/:idOrSlug/lessons/:lessonId` — Get lesson content with previous/next navigation pointers

### Progress (`/api/progress`)
- `GET /api/progress` — Get overall user learning analytics and course breakdowns (*Private*)
- `GET /api/progress/:courseId` — Get user progress for a specific course (*Private*)
- `POST /api/progress/:courseId/lessons/:lessonId/complete` — Mark lesson as completed (*Private*)

### Quizzes (`/api/courses` & `/api/quiz`)
- `GET /api/courses/:courseId/quiz` — Retrieve sanitized quiz questions (*Private*)
- `POST /api/courses/:courseId/quiz/submit` — Submit answers, validate on server, persist attempt (*Private*)
- `GET /api/courses/:courseId/quiz/results` — Retrieve user attempts for a course (*Private*)
- `GET /api/quiz/results/:resultId` — Retrieve specific attempt breakdown and explanations (*Private*)
- `GET /api/quiz/stats` — Get user's overall quiz analytics (*Private*)

---

## 🧪 Automated Testing & Verification

Run the end-to-end backend verification script anytime:
```bash
cd backend
node src/testFlow.js
```

This verifies:
1. User registration, password salting & bcrypt matching.
2. Loading of all 6 courses and curricula.
3. Lesson completion and progress calculation formula (`completed / total * 100`).
4. Idempotent progress handling (duplicate completion calls).
5. Sanitized quiz delivery (answers shielded from client).
6. Server-side answer validation and passing score calculations.
7. Quiz attempt history persistence.
8. Automatic course completion upon finishing all lessons.

---

## 🚢 Production Deployment

### Frontend (e.g., Vercel, Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable: `VITE_API_URL=https://your-backend-api.com/api`

### Backend (e.g., Render, Railway, AWS ECS)
1. Start command: `npm start`
2. Provide production environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.

---

## 📄 License
This project is licensed under the ISC License.
