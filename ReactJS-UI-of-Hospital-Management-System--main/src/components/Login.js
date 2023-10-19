import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faArrowRight, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import image from './assets/image.jpg';
import './fonts.css';
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP

function Login() {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Obtiene la función de navegación

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        usuario: formData.usuario,
        password: formData.password,
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        console.log('Autenticación exitosa');
        navigate('/Dashboard'); // Redirige al usuario a /dashboard después de iniciar sesión
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error de inicio de sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="image">
        <img src={image} alt="Logo" />
      </div>

      <div className="form-container">
        <div className="goodmorning">
          <h1>Login</h1>
          <p>Please sign in to continue.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="input-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="form-control"
              placeholder="Usuario"
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Contraseña"
            />
            <a href="/forgot" className="forgot">
              FORGOT
            </a>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="button">
            <button type="submit" className="login">
              LOGIN
            </button>
            <FontAwesomeIcon className="arrow" icon={faArrowRight} />
          </div>
        </form>

        <div className="footer">
          Don't have an account? <Link to="/create" className="signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
