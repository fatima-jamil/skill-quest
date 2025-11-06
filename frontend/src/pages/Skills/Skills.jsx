import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillsAPI } from '../../services/api';
import { logout } from '../../utils/auth';
import { CheckCircle, BookOpen, Code, Briefcase, LogOut, Home, Target, TrendingUp, Award } from 'lucide-react';
import './Skills.css';

const Skills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [selectedCategory, skills]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await skillsAPI.getAllSkills();
      setSkills(data);
      setError('');
    } catch (err) {
      setError('Failed to load skills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterSkills = () => {
    if (selectedCategory === 'all') {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter(skill => skill.category === selectedCategory));
    }
  };

  const handleCompleteSkill = async () => {
    if (!selectedSkill) return;
    
    setActionLoading(true);
    try {
      const response = await skillsAPI.completeSkill(selectedSkill._id);
      
      if (response.message === 'Skill already completed') {
        setError('You have already completed this skill!');
      } else {
        // Update the skills list to mark this skill as completed
        setSkills(skills.map(skill => 
          skill._id === selectedSkill._id 
            ? { ...skill, isCompleted: true }
            : skill
        ));
        setSelectedSkill({ ...selectedSkill, isCompleted: true });
        setError('');
        alert(`🎉 Skill completed! You earned ${selectedSkill.xpReward} XP!`);
      }
    } catch (err) {
      setError('Failed to complete skill');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getSkillDescription = (skillName) => {
    const descriptions = {
      'JavaScript Fundamentals': 'Master the core concepts of JavaScript including variables, functions, objects, arrays, and ES6+ features. Learn about closures, prototypes, and asynchronous programming.',
      'Node.js Basics': 'Understand server-side JavaScript with Node.js. Learn about modules, npm, event loop, file system operations, and building RESTful APIs.',
      'Express.js Routing': 'Deep dive into Express.js framework. Master routing, middleware, error handling, and building scalable web applications.',
      'MongoDB CRUD': 'Learn NoSQL database operations with MongoDB. Understand documents, collections, queries, aggregation, and data modeling.',
      'React Basics': 'Get started with React library. Learn components, JSX, props, state, hooks, and building interactive user interfaces.',
      'Redux for State Management': 'Master advanced state management with Redux. Understand actions, reducers, store, and integrating Redux with React applications.',
      'REST API Design': 'Learn best practices for designing RESTful APIs. Understand HTTP methods, status codes, versioning, and API documentation.',
      'Authentication & JWT': 'Implement secure authentication systems. Learn about JWT tokens, password hashing, session management, and OAuth.',
      'Git & Version Control': 'Master Git for version control. Learn branching, merging, rebasing, pull requests, and collaborative development workflows.',
      'Docker Essentials': 'Understand containerization with Docker. Learn about images, containers, Docker Compose, and deployment strategies.',
      'Communication Skills': 'Enhance your professional communication abilities. Learn effective presentation, active listening, and clear articulation of ideas.',
      'Time Management': 'Master productivity techniques. Learn prioritization, goal setting, task management, and work-life balance strategies.',
      'Leadership 101': 'Develop essential leadership qualities. Learn about team motivation, decision making, conflict resolution, and inspiring others.',
      'Project Planning': 'Learn project management fundamentals. Understand scope definition, resource allocation, timeline management, and risk assessment.',
      'Sales Fundamentals': 'Master the art of selling. Learn customer psychology, objection handling, closing techniques, and relationship building.',
      'Negotiation Tactics': 'Develop negotiation skills for business success. Learn win-win strategies, persuasion techniques, and deal structuring.',
      'Digital Marketing Basics': 'Understand digital marketing landscape. Learn SEO, social media marketing, content strategy, and analytics.',
      'Public Speaking': 'Overcome stage fright and deliver compelling presentations. Learn speech structure, body language, and audience engagement.',
      'Financial Literacy': 'Understand business finance fundamentals. Learn budgeting, financial statements, cash flow management, and investment basics.',
      'Critical Thinking': 'Develop analytical and problem-solving abilities. Learn logical reasoning, evaluation of arguments, and decision-making frameworks.'
    };
    return descriptions[skillName] || 'Enhance your skills and grow your expertise in this area.';
  };

  if (loading) {
    return (
      <div className="skills-page">
        <div className="loading">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="skills-page">
      {/* Navigation Header */}
      <nav className="skills-nav">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/dashboard')}>
            🎯 Skill Quest
          </div>
          <div className="nav-links">
            <button onClick={() => navigate('/dashboard')} className="nav-link">
              <Home size={20} /> Dashboard
            </button>
            <button onClick={() => navigate('/skills')} className="nav-link active">
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

      {/* Main Content */}
      <div className="skills-container">
        <div className="skills-header">
          <h1>Master Your Skills</h1>
          <p>Choose from 20+ skills across technical and business domains</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Category Filters */}
        <div className="category-filters">
          <button 
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <BookOpen size={18} /> All Skills ({skills.length})
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'technical' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('technical')}
          >
            <Code size={18} /> Technical ({skills.filter(s => s.category === 'technical').length})
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'business' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('business')}
          >
            <Briefcase size={18} /> Business ({skills.filter(s => s.category === 'business').length})
          </button>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <div 
              key={skill._id} 
              className={`skill-card ${skill.isCompleted ? 'completed' : ''}`}
              onClick={() => setSelectedSkill(skill)}
            >
              {skill.isCompleted && (
                <div className="completion-badge">
                  <CheckCircle size={24} />
                </div>
              )}
              <div className="skill-icon">
                {skill.category === 'technical' ? <Code size={32} /> : <Briefcase size={32} />}
              </div>
              <h3 className="skill-name">{skill.name}</h3>
              <div className="skill-meta">
                <span className={`skill-category ${skill.category}`}>
                  {skill.category}
                </span>
                <span className="skill-xp">
                  <Award size={14} /> {skill.xpReward} XP
                </span>
              </div>
              <button className="view-btn">View Course →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="modal-overlay" onClick={() => setSelectedSkill(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSkill(null)}>×</button>
            
            <div className="modal-header">
              <div className="modal-icon">
                {selectedSkill.category === 'technical' ? <Code size={40} /> : <Briefcase size={40} />}
              </div>
              <h2>{selectedSkill.name}</h2>
              <span className={`skill-category ${selectedSkill.category}`}>
                {selectedSkill.category}
              </span>
            </div>

            <div className="modal-body">
              <div className="skill-info">
                <h3>About this Course</h3>
                <p>{getSkillDescription(selectedSkill.name)}</p>
              </div>

              <div className="skill-details">
                <div className="detail-item">
                  <Award size={20} />
                  <span>XP Reward: <strong>{selectedSkill.xpReward}</strong></span>
                </div>
                <div className="detail-item">
                  <BookOpen size={20} />
                  <span>Category: <strong>{selectedSkill.category}</strong></span>
                </div>
              </div>

              <div className="learning-points">
                <h3>What You'll Learn:</h3>
                <ul>
                  <li>Core concepts and fundamentals</li>
                  <li>Best practices and patterns</li>
                  <li>Real-world applications</li>
                  <li>Hands-on practical experience</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              {selectedSkill.isCompleted ? (
                <button className="btn-completed" disabled>
                  <CheckCircle size={20} /> Completed
                </button>
              ) : (
                <button 
                  className="btn-complete"
                  onClick={handleCompleteSkill}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Completing...' : 'Mark as Completed'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;