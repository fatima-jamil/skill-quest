// const API_BASE_URL = 'http://localhost:5050/api';
import { API_BASE_URL } from '../config/api';



const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};


export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};


export const dashboardAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};


export const skillsAPI = {
  getAllSkills: async (category = '') => {
    const url = category 
      ? `${API_BASE_URL}/skills?category=${category}`
      : `${API_BASE_URL}/skills`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  completeSkill: async (skillId) => {
    const response = await fetch(`${API_BASE_URL}/skills/${skillId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};


export const challengesAPI = {
  getAllChallenges: async () => {
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  openChallenge: async (challengeId) => {
    const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/open`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  completeChallenge: async (challengeId) => {
    const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  completeMonthlyChallenge: async () => {
    const response = await fetch(`${API_BASE_URL}/challenges/monthly`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};


export const rankingAPI = {
  getLeaderboard: async (type = 'overall') => {
    const response = await fetch(`${API_BASE_URL}/rankings/leaderboard?type=${type}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};