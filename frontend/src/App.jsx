import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing/Landing.jsx';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

// Placeholder components (we'll create these next)
const Dashboard = () => <div>Dashboard (Coming Soon)</div>;
const Skills = () => <div>Skills (Coming Soon)</div>;
const Challenges = () => <div>Challenges (Coming Soon)</div>;
const Ranking = () => <div>Ranking (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/skills" element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          } />
          <Route path="/challenges" element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          } />
          <Route path="/ranking" element={
            <ProtectedRoute>
              <Ranking />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;