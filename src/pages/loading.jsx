// Loading.jsx
import React from 'react';

const Loading = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
  },
  loader: {
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite',
  },
  text: {
    marginTop: '10px',
    fontSize: '20px',
    color: '#555',
  },
};

export default Loading; // Default export
