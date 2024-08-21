import React from 'react';

function Header() {
  return (
    <header style={{ backgroundColor: '#282c34', color: 'white', textAlign: 'center' }}>
      <h2>Dirección de Investigación</h2>
      <nav>
        <a href="/" style={{ color: 'white', marginRight: '15px' }}>Home</a>
        <a href="/about" style={{ color: 'white' }}>About</a>
      </nav>
    </header>
  );
}

export default Header;