import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar'; 
import { rankingAPI } from '../../services/api';
import { logout, getCurrentUser } from '../../utils/auth';
import { 
  Home, BookOpen, Target, TrendingUp, LogOut, 
  Trophy, Award, Zap, Medal 
} from 'lucide-react';
import './Ranking.css';

const Ranking = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [leaderboardType, setLeaderboardType] = useState('overall');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await rankingAPI.getLeaderboard(leaderboardType);
      setLeaderboardData(data);
      setError('');
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return { icon: <Trophy size={24} />, color: '#ffd700' };
    if (rank === 2) return { icon: <Medal size={24} />, color: '#c0c0c0' };
    if (rank === 3) return { icon: <Medal size={24} />, color: '#cd7f32' };
    return { icon: <Award size={20} />, color: '#667eea' };
  };

  const getXPLabel = () => {
    if (leaderboardType === 'technical') return 'Technical XP';
    if (leaderboardType === 'business') return 'Business XP';
    return 'Total XP';
  };

  if (loading) {
    return (
      <div className="ranking-page">
        <Navbar /> 

        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="ranking-page">

      <Navbar /> 



      <div className="ranking-container">
        <div className="ranking-header">
          <h1>Global Rankings</h1>
          <p>See where you stand among all learners</p>
        </div>

        {error && <div className="error-message">{error}</div>}


        <div className="ranking-tabs">
          <button 
            className={`tab-btn ${leaderboardType === 'overall' ? 'active' : ''}`}
            onClick={() => setLeaderboardType('overall')}
          >
            <Trophy size={20} /> Overall
          </button>
          <button 
            className={`tab-btn ${leaderboardType === 'technical' ? 'active' : ''}`}
            onClick={() => setLeaderboardType('technical')}
          >
            <Zap size={20} /> Technical
          </button>
          <button 
            className={`tab-btn ${leaderboardType === 'business' ? 'active' : ''}`}
            onClick={() => setLeaderboardType('business')}
          >
            <Award size={20} /> Business
          </button>
        </div>


        {leaderboardData && leaderboardData.currentUser && (
          <div className="current-user-card">
            <div className="user-rank-section">
              <div className="rank-display">
                <div className="rank-icon" style={{ color: getRankIcon(leaderboardData.currentUser.rank).color }}>
                  {getRankIcon(leaderboardData.currentUser.rank).icon}
                </div>
                <div className="rank-info">
                  <div className="rank-label">Your Rank</div>
                  <div className="rank-value">#{leaderboardData.currentUser.rank}</div>
                </div>
              </div>
              <div className="xp-display">
                <div className="xp-icon">
                  <Zap size={24} />
                </div>
                <div className="xp-info">
                  <div className="xp-label">{getXPLabel()}</div>
                  <div className="xp-value">{leaderboardData.currentUser.xp}</div>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="leaderboard-section">
          <h2 className="section-title">Top 10 Learners</h2>
          <div className="leaderboard-table">
            {leaderboardData && leaderboardData.topUsers && leaderboardData.topUsers.length > 0 ? (
              leaderboardData.topUsers.map((user, index) => {
                const rank = index + 1;
                const rankInfo = getRankIcon(rank);
                const isCurrentUser = user._id === leaderboardData.currentUser?.id;
                const xpField = leaderboardType === 'technical' ? 'technicalXp' : 
                               leaderboardType === 'business' ? 'businessXp' : 'totalXp';

                return (
                  <div 
                    key={user._id} 
                    className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''} ${rank <= 3 ? 'top-three' : ''}`}
                  >
                    <div className="rank-column">
                      <div className="rank-badge" style={{ color: rankInfo.color }}>
                        {rankInfo.icon}
                        <span className="rank-number">#{rank}</span>
                      </div>
                    </div>
                    <div className="user-column">
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.username}
                          {isCurrentUser && <span className="you-badge">You</span>}
                        </div>
                      </div>
                    </div>
                    <div className="xp-column">
                      <div className="xp-amount">
                        <Zap size={18} />
                        <span>{user[xpField]}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Trophy size={48} />
                <p>No rankings available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;