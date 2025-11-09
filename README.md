# 🎯 Skill Quest - Gamified Learning Platform

A full-stack web application that gamifies learning with XP points, badges, challenges, streaks, and global leaderboards. 20+ technical and business skills!

## ✨ Features

- 🎓 20+ Skills across Technical & Business categories
- 🏆 Challenge System with monthly mega challenges
- 🔥 Streak Tracking for consistent learning
- 📊 Global Leaderboards (Overall, Technical, Business)
- 🎖️ Auto-generated Badge System
- 📈 7-day XP Growth Visualization
- 🔐 JWT Authentication

## 🚀 Quick Start

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/skill-quest.git
cd skill-quest
```

**2. Setup Backend**

```bash
cd backend
npm install
```

Create a `config.env` file in the `backend` folder:
```env
MONGODB_URI=mongodb://localhost:27017/skillquest
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5050
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillquest?retryWrites=true&w=majority
```

**3. Seed the Database**

```bash
# Seed skills (run first)
node seed/skills.js

# Seed challenges
node seed/challenges.js

# Seed monthly challenge
node seed/monthlyChallenge.js
```

**4. Start Backend Server**

```bash
npm start
# Or for development with auto-restart:
npm run dev
```

Backend will run at `http://localhost:5050`

**5. Setup Frontend**

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5050/api
```

**6. Start Frontend**

```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

**7. Open in Browser**

Navigate to `http://localhost:5173` and start learning! 🚀

## 🎮 Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Browse Skills**: Explore 20+ skills in Technical & Business categories
3. **Complete Skills**: Mark skills as completed to earn XP
4. **Take Challenges**: Test your knowledge and earn badges
5. **Build Streaks**: Complete activities daily to maintain your streak
6. **Climb Rankings**: Compete on global leaderboards

## 📁 Project Structure

```
skill-quest/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── skillsController.js
│   │   ├── challengeController.js
│   │   └── rankingController.js
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── Challenge.js
│   │   └── Badge.js
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Helper functions (XP, streak)
│   ├── seed/            # Database seeders
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Auth/
│   │   │   ├── Layout/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/       # Page components
│   │   │   ├── Landing/
│   │   │   ├── Dashboard/
│   │   │   ├── Skills/
│   │   │   ├── Challenges/
│   │   │   └── Ranking/
│   │   ├── services/    # API calls
│   │   ├── utils/       # Helper functions
│   │   ├── config/      # Configuration
│   │   └── App.jsx      # Main app component
│   └── vite.config.js
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** v5.1.0 - Web framework
- **MongoDB** - Database
- **Mongoose** v8.19.2 - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** v19.1.1 - UI library
- **React Router** v7.9.5 - Navigation
- **Lucide React** - Icons
- **Vite** v7.1.14 - Build tool
- **CSS3** - Styling

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Dashboard
- `GET /api/users/dashboard` - Get dashboard data (Protected)

### Skills
- `GET /api/skills` - Get all skills (Protected)
- `GET /api/skills?category=technical` - Filter by category
- `POST /api/skills/:id/complete` - Complete a skill (Protected)

### Challenges
- `GET /api/challenges` - Get all challenges (Protected)
- `POST /api/challenges/:id/open` - Open challenge, update streak (Protected)
- `POST /api/challenges/:id/complete` - Complete challenge (Protected)
- `POST /api/challenges/monthly` - Complete monthly challenge (Protected)

### Rankings
- `GET /api/rankings/leaderboard?type=overall` - Get leaderboard (Protected)
- Query params: `type=overall|technical|business`

## 🌐 Environment Variables

### Backend (`backend/config.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/skillquest

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5050
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
# API URL
VITE_API_URL=http://localhost:5050/api
```

