import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="close-btn" onClick={onClose}>
        &times;
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">About Us</Link>
        </li>
        <li>
          <Link to="/settings">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
