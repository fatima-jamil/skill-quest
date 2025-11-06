import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { logout, getCurrentUser } from '../../utils/auth';
import { 
  Home, BookOpen, Target, TrendingUp, LogOut, Award, 
  Flame, Trophy, Calendar, Zap, CheckCircle 
} from 'lucide-react';
import './Dashboard.css';

// Helper function to get correct day names
const getDayName = (dateString) => {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };



  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-logo">
            🎯 Skill Quest
          </div>
          <div className="nav-links">
            <button onClick={() => navigate('/dashboard')} className="nav-link active">
              <Home size={20} /> Dashboard
            </button>
            <button onClick={() => navigate('/skills')} className="nav-link">
              <BookOpen size={20} /> Skills
            </button>
            <button onClick={() => navigate('/challenges')} className="nav-link">
              <Target size={20} /> Challenges
            </button>
            <button onClick={() => navigate('/ranking')} className="nav-link">
              <TrendingUp size={20} /> Ranking
            </button>
            <button onClick={handleLogout} className="nav-link logout">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-text">
            <h1>Welcome back, {dashboardData?.name || currentUser?.username}! 👋</h1>
            <p>Here's your learning progress overview</p>
          </div>
          <div className="total-xp-badge">
            <Zap size={24} />
            <div>
              <div className="xp-label">Total XP</div>
              <div className="xp-value">{dashboardData?.totalXp || 0}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon skills">
              <CheckCircle size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Skills Completed</div>
              <div className="stat-value">{dashboardData?.skillsCompleted || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon streak">
              <Flame size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value">{dashboardData?.currentStreak || 0} days</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rank">
              <Trophy size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Overall Rank</div>
              <div className="stat-value">#{dashboardData?.overallRank || 'N/A'}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon longest">
              <Calendar size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Longest Streak</div>
              <div className="stat-value">{dashboardData?.longestStreak || 0} days</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - REMOVED MONTHLY CHALLENGE */}
        <div className="main-grid">
          {/* XP Growth Chart - FIXED DAY LABELS */}
          <div className="dashboard-card xp-chart-card">
            <h3 className="card-title">
              <TrendingUp size={20} />
              XP Growth (Last 7 Days)
            </h3>
            <div className="chart-container">
              {dashboardData?.xpGrowth && dashboardData.xpGrowth.length > 0 ? (
                <div className="bar-chart">
                  {dashboardData.xpGrowth.map((day, index) => {
                    const maxXp = Math.max(...dashboardData.xpGrowth.map(d => d.xp), 1);
                    const heightPercent = (day.xp / maxXp) * 100;
                    const dayName = getDayName(day.date);
                    
                    return (
                      <div key={index} className="bar-item">
                        <div className="bar-wrapper">
                          <div 
                            className="bar" 
                            style={{ height: `${heightPercent}%` }}
                            title={`${day.xp} XP on ${dayName}`}
                          >
                            <span className="bar-value">{day.xp}</span>
                          </div>
                        </div>
                        <div className="bar-label">{dayName}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No activity yet. Start completing skills to see your progress!</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills Progress */}
          <div className="dashboard-card skills-progress-card">
            <h3 className="card-title">
              <BookOpen size={20} />
              Skills Progress
            </h3>
            <div className="skills-list">
              {dashboardData?.startedSkillsProgress && dashboardData.startedSkillsProgress.length > 0 ? (
                dashboardData.startedSkillsProgress.map((skill, index) => (
                  <div key={index} className="skill-progress-item">
                    <div className="skill-info">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-type-badge" data-type={skill.type}>
                        {skill.type}
                      </div>
                    </div>
                    <div className="skill-stats">
                      <div className="skill-level">Level {skill.level}</div>
                      <div className="skill-xp">{skill.experience} XP</div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((skill.experience % 100), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Start learning skills to see your progress here!</p>
                  <button className="btn-start" onClick={() => navigate('/skills')}>
                    Browse Skills
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Badges */}
          <div className="dashboard-card badges-card">
            <h3 className="card-title">
              <Award size={20} />
              Recent Badges
            </h3>
            <div className="badges-grid">
              {dashboardData?.recentBadges && dashboardData.recentBadges.length > 0 ? (
                dashboardData.recentBadges.map((badge, index) => (
                  <div key={index} className="badge-item">
                    <div className="badge-icon">
                      <Award size={28} />
                    </div>
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-description">{badge.description}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Complete challenges to earn badges!</p>
                  <button className="btn-start" onClick={() => navigate('/challenges')}>
                    View Challenges
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;