import React, { useState } from 'react';
import { Award, Target, TrendingUp, Users, Zap, BookOpen } from 'lucide-react';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5050${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        alert('✅ Success! Click OK to go to dashboard');
        setShowAuth(false);
      } else {
        setError(data.errors?.[0]?.msg || data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server error. Make sure backend is running on port 5050.');
    } finally {
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px 20px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              fontSize: '28px'
            }}>
              🎯
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#333' }}>
              {isLogin ? 'Welcome Back!' : 'Join Skill Quest'}
            </h2>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              {isLogin ? 'Sign in to continue' : 'Start your adventure'}
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '13px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '13px' }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter username"
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '13px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter email"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '13px' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Enter password"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px'
            }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    { icon: <BookOpen size={36} />, title: '20+ Skills', desc: 'Master technical and business skills' },
    { icon: <Target size={36} />, title: 'Monthly Challenges', desc: 'Complete challenges and earn rewards' },
    { icon: <Award size={36} />, title: 'Earn Badges', desc: 'Showcase your achievements' },
    { icon: <TrendingUp size={36} />, title: 'Track Progress', desc: 'Monitor XP and skill growth' },
    { icon: <Zap size={36} />, title: 'Daily Streaks', desc: 'Build learning habits' },
    { icon: <Users size={36} />, title: 'Leaderboards', desc: 'Compete and climb rankings' }
  ];

  return (
    <div style={{ background: '#0f0f23', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '50px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎯</div>
          <h1 style={{ fontSize: '36px', margin: '0 0 15px', fontWeight: 'bold' }}>
            Welcome to Skill Quest
          </h1>
          <p style={{ fontSize: '18px', margin: '0 0 30px', opacity: 0.95 }}>
            Level up your skills through gamified learning
          </p>
          <button
            onClick={() => setShowAuth(true)}
            style={{
              padding: '14px 35px',
              fontSize: '17px',
              fontWeight: 'bold',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '50px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', color: 'white', marginBottom: '40px' }}>
          Why Choose Skill Quest?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '2px solid #2a2a4e'
              }}
            >
              <div style={{ color: '#667eea', marginBottom: '15px' }}>{f.icon}</div>
              <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '10px', margin: '0 0 10px' }}>
                {f.title}
              </h3>
              <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '12px', margin: '0 0 12px' }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ fontSize: '16px', marginBottom: '20px', opacity: 0.9, margin: '0 0 20px' }}>
          Join thousands of learners mastering new skills
        </p>
        <button
          onClick={() => setShowAuth(true)}
          style={{
            padding: '12px 35px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}
        >
          Get Started Free
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          h1 { font-size: 28px !important; }
          h2 { font-size: 24px !important; }
          p { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;