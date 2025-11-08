import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar'; 
import { challengesAPI } from '../../services/api';
import { logout } from '../../utils/auth';
import { 
  Home, BookOpen, Target, TrendingUp, LogOut, 
  Award, Zap, CheckCircle, Calendar, Trophy 
} from 'lucide-react';
import './Challenges.css';

const Challenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await challengesAPI.getAllChallenges();
      setChallenges(data);
      setError('');
    } catch (err) {
      setError('Failed to load challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChallenge = async (challengeId) => {
    try {
      await challengesAPI.openChallenge(challengeId);
    } catch (err) {
      console.error('Failed to update streak:', err);
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    setActionLoading(true);
    try {
      const response = await challengesAPI.completeChallenge(challengeId);
      
      if (response.message === 'Challenge already completed') {
        alert('You have already completed this challenge!');
      } else {

        setChallenges(challenges.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, isCompleted: true }
            : challenge
        ));
        setSelectedChallenge(null);
        alert(`🎉 Challenge completed! You earned ${response.badge.name}!`);
      }
    } catch (err) {
      setError('Failed to complete challenge');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteMonthlyChallenge = async () => {
  setActionLoading(true);
  try {
    const response = await challengesAPI.completeMonthlyChallenge();
    
    if (response.message === 'Monthly challenge already completed') {
      alert('You have already completed this month\'s challenge!');
    } else {

      alert(`🎉 Monthly challenge completed! You earned 1 exclusive badge and ${response.technicalXp} XP!`);
      fetchChallenges();
    }
  } catch (err) {
    setError('Failed to complete monthly challenge');
    console.error(err);
  } finally {
    setActionLoading(false);
  }
};

  const handleLogout = () => {
    logout();
  };


  const regularChallenges = challenges.filter(c => !c.isMonthly);
  const monthlyChallenge = challenges.find(c => c.isMonthly);

  if (loading) {
    return (
      <div className="challenges-page">
        <Navbar /> 
        <div className="loading">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="challenges-page">

      <Navbar /> 


      <div className="challenges-container">
        <div className="challenges-header">
          <h1>Skill Challenges</h1>
          <p>Test your knowledge and earn badges</p>
        </div>

        {error && <div className="error-message">{error}</div>}



{monthlyChallenge && (
  <div className="monthly-challenge-section">
    <div className="monthly-challenge-card">
      <div className="monthly-badge">
        <Calendar size={32} />
        <span>Monthly Challenge</span>
      </div>
      <h2>{monthlyChallenge.title}</h2>
      <p>Complete this month's mega challenge for massive rewards!</p>
      <div className="monthly-rewards">
        <div className="reward-item">
          <Zap size={24} />
          <div>
            <div className="reward-label">XP Reward</div>
            <div className="reward-value">{monthlyChallenge.xpReward}</div>
          </div>
        </div>
        <div className="reward-item">
          <Trophy size={24} />
          <div>
            <div className="reward-label">Badge</div>

            <div className="reward-value">1 Exclusive</div>
          </div>
        </div>
      </div>
      {monthlyChallenge.isCompleted ? (
        <button className="btn-completed" disabled>
          <CheckCircle size={20} /> Completed This Month
        </button>
      ) : (
        <button 
          className="btn-monthly-challenge"
          onClick={handleCompleteMonthlyChallenge}
          disabled={actionLoading}
        >
          {actionLoading ? 'Processing...' : 'Start Monthly Challenge →'}
        </button>
      )}
    </div>
  </div>
)}


        <div className="challenges-section">
          <h2 className="section-title">Skill Challenges</h2>
          <div className="challenges-grid">
            {regularChallenges.map((challenge) => (
              <div 
                key={challenge._id} 
                className={`challenge-card ${challenge.isCompleted ? 'completed' : ''}`}
              >
                {challenge.isCompleted && (
                  <div className="completion-badge">
                    <CheckCircle size={24} />
                  </div>
                )}
                <div className="challenge-icon">
                  <Target size={32} />
                </div>
                <h3 className="challenge-title">{challenge.title}</h3>
                <div className="challenge-skill">
                  {challenge.skill?.name || 'Unknown Skill'}
                </div>
                <div className="challenge-rewards-inline">
                  <div className="reward-badge">
                    <Zap size={16} /> {challenge.xpReward} XP
                  </div>
                  <div className="reward-badge">
                    <Award size={16} /> 1 Badge
                  </div>
                </div>
                {challenge.isCompleted ? (
                  <button className="btn-challenge-completed" disabled>
                    <CheckCircle size={18} /> Completed
                  </button>
                ) : (
                  <button 
                    className="btn-challenge-start"
                    onClick={() => {
                      handleOpenChallenge(challenge._id);
                      setSelectedChallenge(challenge);
                    }}
                  >
                    Start Test →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


      {selectedChallenge && (
        <div className="modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedChallenge(null)}>×</button>
            
            <div className="modal-header">
              <div className="modal-icon">
                <Target size={40} />
              </div>
              <h2>{selectedChallenge.title}</h2>
            </div>

            <div className="modal-body">
              <div className="challenge-info">
                <h3>About This Challenge</h3>
                <p>Test your knowledge of {selectedChallenge.skill?.name || 'this skill'} and earn rewards!</p>
              </div>

              <div className="challenge-details">
                <div className="detail-item">
                  <Zap size={20} />
                  <span>XP Reward: <strong>{selectedChallenge.xpReward}</strong></span>
                </div>
                <div className="detail-item">
                  <Award size={20} />
                  <span>Badge: <strong>1 Exclusive Badge</strong></span>
                </div>
              </div>

              <div className="challenge-instructions">
                <h3>Instructions:</h3>
                <ul>
                  <li>Answer all questions to the best of your ability</li>
                  <li>You can only complete this challenge once</li>
                  <li>Rewards will be added to your profile instantly</li>
                  <li>Your streak will be updated upon completion</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-complete-challenge"
                onClick={() => handleCompleteChallenge(selectedChallenge._id)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Submitting...' : 'Complete Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;