import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase'; // Ensure this is the correct path to your Firebase config
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to show while waiting for signup
  const navigate = useNavigate(); // Use navigate to redirect after signup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { email, password, username } = userData;

    // Basic input validation
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Sign up the user with email and password using Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Now that the user is signed up, we can use their Firebase UID
      const firebase_user_id = user.uid;

      // Prepare user data to send to the database (including the password)
      const payload = {
        firebase_user_id, // Firebase-generated user ID
        email: user.email,
        username,
        password, // Including the password
      };

      // Send the payload to your backend API
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const backendError = await response.json();
        setError(backendError.message || 'Failed to save user data to the database');
        setLoading(false);
        return;
      }

      alert('Signup successful!');
      navigate('/profile'); // Redirect to the profile page or dashboard
    } catch (err) {
      if (err.code?.includes('auth/')) {
        setError('Authentication error: ' + err.message);
      } else {
        setError(err.message || 'An error occurred during signup');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;
