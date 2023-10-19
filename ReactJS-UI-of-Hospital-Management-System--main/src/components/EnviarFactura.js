import React, { useState, useEffect } from 'react';
import './EnviarFactura.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EnviarFactura() {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [detalleFactura, setDetalleFactura] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [isSendingSync, setIsSendingSync] = useState(false);
  const [isSendingAsync, setIsSendingAsync] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3001/factura')
      .then((response) => {
        setFacturas(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las facturas:', error);
      });
  }, []);

  const handleRowClick = (factura) => {
    setSelectedFactura(factura);
  };

  const toggleCheckbox = (factura) => {
    const selectedIndex = selectedItems.indexOf(factura.n_factura);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, factura.n_factura]);
    } else {
      setSelectedItems([
        ...selectedItems.slice(0, selectedIndex),
        ...selectedItems.slice(selectedIndex + 1),
      ]);
    }
  };

  const openModal = () => {
    if (selectedFactura) {
      axios
        .get(`http://localhost:3001/facturadetalle?n_factura=${selectedFactura.n_factura}`)
        .then((response) => {
          setDetalleFactura(response.data);
          setShowModal(true);
        })
        .catch((error) => {
          console.error('Error al obtener los detalles de la factura:', error);
        });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFactura(null);
    setDetalleFactura([]);
  };

  const enviarFacturaSincrona = async () => {
    if (selectedItems.length === 0 || isSendingSync) {
      alert('Selecciona al menos una factura para enviar o espera a que termine el proceso anterior.');
      return;
    }

    setIsSendingSync(true);

    for (const n_factura of selectedItems) {
      try {
        const response = await axios.post('http://localhost/api-sync/enviar-factura-sincrona', {
          n_factura: n_factura,
          // Otros datos de la factura si es necesario
        });

        console.log('Factura enviada síncronamente:', response.data);
        toast.success(`Factura ${n_factura} enviada síncronamente`);
      } catch (error) {
        console.error(`Error al enviar la factura ${n_factura} síncronamente:`, error);
        toast.error(`Error al enviar la factura ${n_factura} síncronamente`);
      }
    }

    setIsSendingSync(false);
    setSelectedItems([]);
  };

  const enviarFacturaAsincrona = async () => {
    if (selectedItems.length === 0 || isSendingAsync) {
      alert('Selecciona al menos una factura para enviar o espera a que termine el proceso anterior.');
      return;
    }

    setIsSendingAsync(true);

    for (const n_factura of selectedItems) {
      try {
        // Construye un objeto con los datos de la factura
        const factura = facturas.find((factura) => factura.n_factura === n_factura);
        const facturaData = {
          n_factura: factura.n_factura,
          idtercero: factura.idtercero,
          fecha: factura.fecha,
          valortotal: factura.valortotal,
          estado: factura.estado,
          numdocumento: factura.numdocumento,
          idusuario: factura.idusuario,
        };

        // Simula una pausa de 3 segundos antes de continuar
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Envía el objeto con los datos de la factura como mensaje
        await axios.post('http://localhost:3001/send-async-message', { message: JSON.stringify(facturaData) });

        console.log('Factura enviada asíncronamente:', facturaData);
        toast.success(`Factura ${facturaData.n_factura} enviada asíncronamente`);
      } catch (error) {
        console.error(`Error al enviar la factura ${n_factura} asíncronamente:`, error);
        toast.error(`Error al enviar la factura ${n_factura} asíncronamente`);
      }
    }

    setIsSendingAsync(false);
    setSelectedItems([]);
  };

  return (
    <div className="enviar-factura-container">
      <h2>Facturas</h2>
      <button
        className="enviar-factura-button"
        onClick={() => {
          alert(`Enviar Factura Síncrono (${selectedItems.length})`);
        }}
      >
        Enviar Factura Síncrono ({selectedItems.length})
      </button>
      <button
        className="enviar-factura-button"
        onClick={enviarFacturaSincrona}
        disabled={isSendingSync}
      >
        {isSendingSync ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          `Enviar Factura Síncrono (${selectedItems.length})`
        )}
      </button>
      <button
        className="enviar-factura-button"
        onClick={enviarFacturaAsincrona}
        disabled={isSendingAsync}
      >
        {isSendingAsync ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          `Enviar Factura Asincrono (${selectedItems.length})`
        )}
      </button>
      <table className="facturas-table">
        <thead>
          <tr>
            <th>ID Factura</th>
            <th>ID Tercero</th>
            <th>Fecha</th>
            <th>Valor Total</th>
            <th>Estado</th>
            <th>Número de Documento</th>
            <th>Ver Detalle</th>
            <th>Seleccion</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr
              key={factura.consecutivo}
              onClick={() => handleRowClick(factura)}
              className={selectedFactura === factura ? 'selected' : ''}
            >
              <td>{factura.n_factura}</td>
              <td>{factura.idtercero}</td>
              <td>{factura.fecha}</td>
              <td>{factura.valortotal}</td>
              <td>{factura.estado}</td>
              <td>{factura.numdocumento}</td>
              <td>
                <button
                  className="ver-detalle-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                >
                  Ver Detalle
                </button>
              </td>
              <td>
                <input
                  type="checkbox"
                  onChange={() => toggleCheckbox(factura)}
                  checked={selectedItems.includes(factura.n_factura)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Detalles de la Factura</h2>
              {selectedFactura && (
                <div>
                  <p>ID Factura: {selectedFactura.n_factura}</p>
                </div>
              )}
              <h3>Detalles:</h3>
              <table className="detalle-table">
                <thead>
                  <tr>
                    <th>ID Servicio</th>
                    <th>Descripción del Servicio</th>
                    <th>Valor del Servicio</th>
                    <th>Cantidad del Servicio</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleFactura.map((detalle) => (
                    <tr key={detalle.consecutivo_factura}>
                      <td>{detalle.idservicio}</td>
                      <td>{detalle.descservicio}</td>
                      <td>{detalle.valorservicio}</td>
                      <td>{detalle.cantidadservicio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="close-modal-button" onClick={closeModal}>
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default EnviarFactura;
