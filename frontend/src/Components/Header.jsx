import React from 'react';
import '../Styles/Header.css'
import 'bootstrap/dist/css/bootstrap.min.css';



const Header = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="navbar navbar-light fleet-header">
      <h1>UNILEVER FLEET FLOW</h1>
      <p className="header-timestamp">{formattedDate}</p>
    </header>
  );
};

export default Header;