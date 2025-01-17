// src/services/authService.js
export const registerUser = async (userData) => {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
  
    const data = await response.json();
    return data;
  };
  // src/services/authService.js
export const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data = await response.json();
    localStorage.setItem('token', data.token);  // Store token
    return data.token;
  };
  