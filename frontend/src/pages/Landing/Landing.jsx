import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Target, TrendingUp, Users, Zap, BookOpen } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen size={40} />,
      title: '20+ Skills',
      description: 'Master technical and business skills through interactive courses'
    },
    {
      icon: <Target size={40} />,
      title: 'Monthly Challenges',
      description: 'Complete monthly challenges and earn massive rewards'
    },
    {
      icon: <Award size={40} />,
      title: 'Earn Badges',
      description: 'Collect badges and showcase your achievements'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Track Progress',
      description: 'Monitor your XP growth and skill progression'
    },
    {
      icon: <Zap size={40} />,
      title: 'Daily Streaks',
      description: 'Build consistent learning habits with streak tracking'
    },
    {
      icon: <Users size={40} />,
      title: 'Leaderboards',
      description: 'Compete with others and climb the rankings'
    }
  ];

  return (
    <div className="landing-page">

      <section className="hero-section">
        <div className="container">
          <div className="hero-emoji">🎯</div>
          <h1 className="hero-title">Welcome to Skill Quest</h1>
          <p className="hero-subtitle">
            Level up your skills through gamified learning experiences
          </p>
          <button 
            className="btn-primary btn-large"
            onClick={() => navigate('/signup')}
          >
            Get Started →
          </button>
        </div>
      </section>


      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Skill Quest?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Join thousands of learners mastering new skills every day
          </p>
          <button 
            className="btn-primary btn-large"
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;