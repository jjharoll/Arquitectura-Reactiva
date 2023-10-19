import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer({ handleHomeClick, handleNotificationClick, handleMessageClick }) {
  return (
    <footer className="footer">
      <Link to='/Dashboard'>
      <button onClick={handleHomeClick}>
        <FontAwesomeIcon icon={faHome} />
      </button>
      </Link>
      <Link to='/Notification'>      
      <button onClick={handleNotificationClick}>
        <FontAwesomeIcon icon={faBell} />
      </button>
      </Link>
      <button onClick={handleMessageClick}>
        <FontAwesomeIcon icon={faEnvelope} />
      </button>
    </footer>
  );
}

export default Footer;
