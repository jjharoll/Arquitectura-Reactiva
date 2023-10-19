import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import './Create.css';
import image from './assets/image.jpg';
import './fonts.css';

function Create() {
  return (
    <div className="heading2">
      <div className="image2">
        <img src={image} alt="Logo" />
      </div>
      <Link to="/login" className="arrowleft">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <div className="goodmorning2">
        <h1>Create Account</h1>
      </div>

      <form className="form-container2">
        <div className="forms2">
          <div className="form-group2">
            <div className="input-icon2">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <input
              type="text"
              id="name"
              className="form-control2"
              placeholder="FULL NAME"
            />
          </div>
          <div className="form-group2">
            <div className="input-icon2">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="text"
              id="email"
              className="form-control2"
              placeholder="EMAIL"
            />
          </div>
          <div className="form-group2">
            <div className="input-icon2">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              id="password"
              className="form-control2"
              placeholder="PASSWORD"
            />
          </div>
          <div className="form-group2">
            <div className="input-icon2">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              id="cpassword"
              className="form-control2"
              placeholder="CONFIRM PASSWORD"
            />
          </div>

        </div>
      </form>

      <div className="button2">
        <button type="submit" className="login2">
          <Link to="/Otp" className='signup-link'>SIGN UP</Link>
        </button>
        <FontAwesomeIcon className="arrow2" icon={faArrowRight} />
      </div>

      <div className="footer2">
        Already have an account? <Link to="/login" className="signup2">Sign in</Link>
      </div>
    </div>
  );
}

export default Create;
