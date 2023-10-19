import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import './Forgot.css';
import image from './assets/image.jpg';
import './fonts.css';

function Forgot() {
  return (
    <div className="heading4">
      <div className="image4">
        <img src={image} alt="Logo" />
      </div>
      <Link to="/login" className="arrowleft">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <div className="goodmorning4">
        <h1>Forgot Password?</h1>
        <p>Enter your registered email to reset your password.</p>
      </div>
      <form className="form">
          <div className="forms4">
            <div className="form-group4">
              <div className="input-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <input
                type="text"
                id="email"
                className="form-control4"
                placeholder="EMAIL"
              />
            </div>
        </div>
        </form>
        <div className="button4">
        <button type="submit" className="login4">SUBMIT</button>
        <FontAwesomeIcon className="arrow4" icon={faArrowRight} />
      </div>
    </div>
  );
}

export default Forgot;
