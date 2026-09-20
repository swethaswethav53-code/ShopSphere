import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', color: '#e74c3c', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '10px 0 20px' }}>Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;