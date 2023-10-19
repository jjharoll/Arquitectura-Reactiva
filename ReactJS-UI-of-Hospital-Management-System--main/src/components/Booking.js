import React, { useState } from 'react';
import './Booking.css';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Navbar from './Navbar';
import Footer from './Footer';

function Booking() {
  const [razonSocial, setRazonSocial] = useState('');
  const [nit, setNit] = useState('');
  const [dv, setDv] = useState('');
  const [tipo, setTipo] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const handleRazonSocialChange = (event) => {
    setRazonSocial(event.target.value);
  };

  const handleNitChange = (event) => {
    setNit(event.target.value);
  };

  const handleDvChange = (event) => {
    setDv(event.target.value);
  };

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Crear un objeto de tercero
    const newTercero = {
      razonsocial: razonSocial,
      nit: nit,
      dv: dv,
      tipo: tipo,
    };

    try {
      // Realizar una solicitud POST al servidor backend para crear el tercero
      const response = await fetch('http://localhost:3003/crear-tercero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTercero),
      });

      if (response.ok) {
        setShowSuccessAlert(true); // Mostrar alerta de éxito
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate('/Dashboard?terceroCreated=true'); // Navegar al dashboard después de la alerta
        }, 2000); // Ocultar la alerta después de 2 segundos (ajusta el tiempo según sea necesario)
      } else {
        // Manejar errores de creación aquí
        console.error('Error al crear el tercero');
      }
    } catch (error) {
      // Manejar errores de red aquí
      console.error('Error de red al crear el tercero', error);
    }
  };

  return (
    <div className="heading7">
      <Navbar backButton={true} />
      <div className="form-container7">
        <h2>Crear Tercero</h2>
        {showSuccessAlert && (
          <div className="success-alert">
            Tercero creado correctamente.
          </div>
        )}
        <form className="booking-form" onSubmit={handleSubmit}>
          <TextField
            id="razonSocial"
            label="Nombre Razon Social"
            variant="outlined"
            value={razonSocial}
            onChange={handleRazonSocialChange}
            fullWidth
            required
            color='error'
          />
          <TextField
            id="nit"
            label="Nit"
            variant="outlined"
            value={nit}
            onChange={handleNitChange}
            fullWidth
            required
            color='error'
          />
          <TextField
            id="dv"
            label="Dv"
            variant="outlined"
            value={dv}
            onChange={handleDvChange}
            fullWidth
            required
            color='error'
          />
          <TextField
            id="tipo"
            label="Tipo"
            variant="outlined"
            value={tipo}
            onChange={handleTipoChange}
            fullWidth
            required
            color='error'
          />
          <div className='checky'>
            <p>Audio/Video appointment:</p>
            <Checkbox defaultChecked color="error" />
          </div>
          <p className='consent'>Recuerde que la facturación se realiza con esta información registrada.</p>
          <div className="button8">
            {showSuccessAlert ? (
              <button type="button" className="login8" disabled>Crear</button>
            ) : (
              <button type="submit" className="login8">Crear</button>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Booking;
