import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faList,
  faFlask,
  faMicroscope,
  faPrescriptionBottleAlt,
  faFileUpload,
  faFileAlt,
  faClipboardList,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';
import './fonts.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


function Dashboard() {

  const handleCardClick = (cardTitle) => {
    console.log(`Clicked on ${cardTitle} card`);
    const card = document.getElementById(cardTitle);
    card.classList.add('bounce');
    setTimeout(() => {
      card.classList.remove('bounce');
    }, 300);
  }

  return (
    <div className="heading5">
      <Navbar backButton={false} />
      <div className="card-container">
        <Link
          to="/Tab"
          className="card"
          onClick={() => handleCardClick('Crear Tercero')}
          id="Crear Tercero"
        >
          <FontAwesomeIcon icon={faPlus} size="2x" />
          <h2 className="words">Crear Tercero</h2>
        </Link>
        <Link
          to="/Factura"
          className="card"
          onClick={() => handleCardClick('Enviar facturas')}
          id="Factura"
        >
          <FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />
          <h2 className="words">Crear facturas</h2>
          </Link>
        <Link
          to="/Reportes"
          className="card"
          onClick={() => handleCardClick('Reportes')}
          id="Reportes"
        >   <FontAwesomeIcon icon={faClipboardList} size="2x" />
        <h2 className="words">Reportes</h2>
        </Link>
        <Link
          to="/EnviarFactura"
          className="card"
          onClick={() => handleCardClick('EnviarFactura')}
          id="EnviarFactura"
        >

          <FontAwesomeIcon icon={faFileUpload} size="2x" />
          <h2 className="words">Enviar Facturas</h2>
        </Link>
        <div className="card" onClick={() => handleCardClick('Laboratorio')} id="Laboratorio">
          <FontAwesomeIcon icon={faFlask} size="2x" />
          <h2 className="words">Laboratorio</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('Radiologia')} id="Radiologia">
          <FontAwesomeIcon icon={faMicroscope} size="2x" />
          <h2 className="words">Radiologia</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('Prescipcion')} id="Prescipcion">
          <FontAwesomeIcon icon={faPrescriptionBottleAlt} size="2x" />
          <h2 className="words">Prescipcion</h2>
        </div>
        
        <div className="card" onClick={() => handleCardClick('Detalles')} id="Detalles">
          <FontAwesomeIcon icon={faFileAlt} size="2x" />
          <h2 className="words">Detalles</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('Citas')} id="Citas">
          <FontAwesomeIcon icon={faList} size="2x" />
          <h2 className="words">Citas</h2>
        </div>
      </div>
      <Footer />
    </div>

    
  );
}

export default Dashboard;
