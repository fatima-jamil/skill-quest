// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Save user data after login/signup
export const saveUserData = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};