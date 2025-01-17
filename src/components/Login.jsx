import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase'; // Ensure this is the correct path to your Firebase config
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Axios for making API requests
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Use navigate for redirection after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sign in with email and password using Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send the firebase_user_id to your backend to check if the user exists in the database
      const response = await axios.post('http://localhost:5000/users', {
        firebase_user_id: user.uid,
        email: user.email
      });

      if (response.data.message === 'User found') {
        // If user is found, navigate to their profile page
        navigate('/profile');
      } else {
        // If user is not found, display an error or handle accordingly
        setError('User not found in the database.');
      }

      // Save user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        firebase_user_id: user.uid,
        email: user.email,
        // You can add more user data here if needed
      }));

    } catch (err) {
      setError(err.message);  // Display error message if any
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div>
          <button type="button" disabled={loading}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
