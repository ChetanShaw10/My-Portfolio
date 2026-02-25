
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './App.css';


function App() {
  const [page, setPage] = useState<'login' | 'signup'>('login');

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 16 }}>
        <button
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: 'none',
            background: page === 'login' ? '#7c3aed' : '#ddd',
            color: page === 'login' ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: 500
          }}
          onClick={() => setPage('login')}
        >
          Login
        </button>
        <button
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: 'none',
            background: page === 'signup' ? '#7c3aed' : '#ddd',
            color: page === 'signup' ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: 500
          }}
          onClick={() => setPage('signup')}
        >
          Sign Up
        </button>
      </div>
      {page === 'login' ? <Login /> : <Signup />}
    </>
  );
}

export default App
