import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Notification.css';
import doctorLogo from './doctor_logo.jpg';

const Notification = () => {
  const notifications = [
    { id: 1, message: 'Prescriptions booked successfully.' },
    { id: 2, message: 'Dr. Javed has accepted your appointment.' },
    { id: 3, message: 'Lab Reports have been submitted.' },
    { id: 4, message: 'Aadhar Card verified successfully.'},
    { id: 5, message: 'You will be further informed regarding your appointment. '},
    { id: 6, message: 'You have filled in for an appointment for Dr. Javed at 2pm on 20th July 2023.'}
  ];

  return (    
    <div className="headingn">
      <Navbar backButton={true} />
      <div className="notification-container">
        <h1>Notifications:</h1>
        <div className="notification-boxes">
          {notifications.map((notification) => (
            <div className="notification-box" key={notification.id}>
              {notification.message}
              <img src={doctorLogo} alt="Doctor Logo" className='doccy' />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notification;
