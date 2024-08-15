import React from 'react';

function Header() {
  return (
    <header style={{ backgroundColor: '#282c34', padding: '10px', color: 'white', textAlign: 'center' }}>
      <h1>Di-Forms</h1>
      <nav>
        <a href="/" style={{ color: 'white', marginRight: '15px' }}>Home</a>
        <a href="/about" style={{ color: 'white' }}>About</a>
      </nav>
    </header>
  );
}

export default Header;