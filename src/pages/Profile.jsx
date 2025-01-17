import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ user, setUser }) {
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load user data from props or localStorage
  useEffect(() => {
    if (user) {
      setEditableUser(user);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setEditableUser(JSON.parse(storedUser));
        setUser(JSON.parse(storedUser));
      } else {
        navigate('/login'); // Redirect to login if no user data
      }
    }
  }, [user, setUser, navigate]);

  // Handle profile update and save
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editableUser.name || !editableUser.email) {
      setError('Name and email are required fields.');
      return;
    }

    // Save updated user data to localStorage
    localStorage.setItem('user', JSON.stringify(editableUser));
    setUser(editableUser); // Update the user in the app state
    setIsEditing(false);
    setError('');
    alert('Profile updated successfully!');
  };

  // Handle changes in the input fields
  const handleChange = (e) => {
    setEditableUser({
      ...editableUser,
      [e.target.name]: e.target.value,
    });
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // If no user data found, display login message
  if (!editableUser) {
    return null; // Do nothing if there's no user data
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={editableUser.name}
            onChange={handleChange}
            style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={editableUser.email}
            onChange={handleChange}
            style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
          />
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={editableUser.address || ''}
            onChange={handleChange}
            style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
          />
          <button onClick={handleSave} style={{ padding: '10px 20px', margin: '10px' }}>Save</button>
          <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', margin: '10px' }}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {editableUser.name}</p>
          <p><strong>Email:</strong> {editableUser.email}</p>
          <p><strong>Address:</strong> {editableUser.address || 'Not provided'}</p>
          <button onClick={handleEdit} style={{ padding: '10px 20px', margin: '10px' }}>Edit Profile</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', margin: '10px' }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
