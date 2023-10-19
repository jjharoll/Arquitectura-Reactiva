import React, { useRef } from 'react';
import './Otp.css';
import image from './assets/image.jpg';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './fonts.css';

function Otp() {
  const inputRefs = Array.from({ length: 4 }, () => useRef(null));

  const handleInput = (index, e) => {
    const input = e.target;
    const value = input.value;

    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  
    const pasteData = e.clipboardData.getData('text/plain');
    const digits = pasteData.slice(0, 4).split('');
  
    let currentIndex = 0;
  
    for (let i = 0; i < inputRefs.length; i++) {
      const inputRef = inputRefs[i];
      if (currentIndex < digits.length) {
        const digit = digits[currentIndex];
        inputRef.current.value = digit;
        currentIndex++;
  
        if (currentIndex < digits.length) {
          inputRefs[i + 1].current.focus();
        }
      }
    }
  };
  

  return (
    <div className="heading3">
      <div className="image3">
        <img src={image} alt="Logo" />
      </div>
      <Link to="/Create" className="arrowleft">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
      <div className="goodmorning3">
        <h1>Enter OTP</h1>
        <p>Check your Email for the OTP.</p>
      </div>
      <div className="otp-c">
        {inputRefs.map((inputRef, index) => (
          <div className="box" key={index}>
            <input
              type="number"
              className="otp-input"
              maxLength="1"
              ref={inputRef}
              onChange={(e) => handleInput(index, e)}
              onPaste={handlePaste}
            />
          </div>
        ))}
      </div>
      <div className="button3">
        <button type="submit" className="login3">SUBMIT</button>
        <FontAwesomeIcon className="arrow3" icon={faArrowRight} />
      </div>
    </div>
  );
}

export default Otp;
