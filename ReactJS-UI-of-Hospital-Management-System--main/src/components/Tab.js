import React, { useState } from 'react';
import './Tab.css';
import { Link } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Navbar from './Navbar';
import Footer from './Footer';

function Tab() {
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <div className="heading6">
      <Navbar backButton={true} />
      <div className="card-container2">
        <div className="card2">
          <div className="Form-containera">
            <h2>Crear Tercero </h2>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              className="Formy"
              aria-label="location"
              name="location"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <FormControlLabel
                value="RohiComni"
                control={<Radio color="error" />}
                label="Persona Natural"
                className="radys1"
              />
              <FormControlLabel
                value="Empresa"
                control={<Radio color="error" />}
                label="Empresa"
                className="radys2"
              />
            </RadioGroup>
            <h1 className="words2">Creacion de Terceros</h1>
            <p className='para'>• Proceso de creacion de terceros.</p>
            <p className='para'>• Posterior a el proceso de creacion se debe enviar factura.</p>
            <div className="button6">
              <Link to="/Booking" className="login6">
                <button type="submit" className="next">
                  Continuar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Tab;
