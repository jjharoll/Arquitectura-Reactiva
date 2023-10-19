import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import image from './assets/image.jpg';
import './Navbar.css';
import Sidebar from './Sidebar';

const Navbar = ({ backButton }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="Navbar">
      {backButton ? (
        <Link to="/Dashboard" className="backarrow">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      ) : (
        <div className="hamicon" onClick={handleSidebarToggle}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      )}
      <div className="name">
        <p>UNICIA <br/>CLINTOS</p>
      </div>
      <div className="image5">
        <img src={image} alt="Logo" />
      </div>
      {showSidebar && <Sidebar />} {/* Display the Sidebar when showSidebar state is true */}
    </div>
  );
};

export default Navbar;
