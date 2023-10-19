import React, { useState, useEffect } from 'react';
import './Factura.css'; // Asegúrate de crear el archivo Factura.css para los estilos
import Navbar from './Navbar';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Factura() {
  const [nFactura, setNFactura] = useState('');
  const [idTercero, setIdTercero] = useState('');
  const [fecha, setFecha] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [numDocumento, setNumDocumento] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idServicioSeleccionado, setIdServicioSeleccionado] = useState('');
  const [terceros, setTerceros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cantidadServicioSeleccionado, setCantidadServicioSeleccionado] = useState(0);
  const [serviciosFactura, setServiciosFactura] = useState([]);

  useEffect(() => {
    cargarTerceros();
    cargarUsuarios();
    cargarServicios();
    cargarServiciosDesdeLocalStorage();
  }, []);

  const agregarServicioALocalStorage = (servicio) => {
    const serviciosLocalStorage = JSON.parse(localStorage.getItem('serviciosFactura')) || [];
    serviciosLocalStorage.push(servicio);
    localStorage.setItem('serviciosFactura', JSON.stringify(serviciosLocalStorage));
  };

  const cargarServiciosDesdeLocalStorage = () => {
    const serviciosLocalStorage = JSON.parse(localStorage.getItem('serviciosFactura')) || [];
    setServiciosFactura(serviciosLocalStorage);
  };

  const cargarTerceros = async () => {
    try {
      const response = await fetch('http://localhost:3003/obtener-terceros');
      if (response.ok) {
        const data = await response.json();
        setTerceros(data);
      } else {
        console.error('Error al obtener terceros');
      }
    } catch (error) {
      console.error('Error de red al obtener terceros', error);
    }
  };

  const cargarServicios = async () => {
    try {
      const response = await fetch('http://localhost:3003/obtener-servicios');
      if (response.ok) {
        const data = await response.json();
        setServicios(data);
        setCantidadServicioSeleccionado(0);
      } else {
        console.error('Error al obtener servicios');
      }
    } catch (error) {
      console.error('Error de red al obtener servicios', error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3003/obtener-usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error de red al obtener usuarios', error);
    }
  };

  const handleAgregarServicio = async () => {
    let servicioSeleccionado = servicios.find((servicio) => servicio.idservicio == idServicioSeleccionado);
    if (servicioSeleccionado) {
      const servicioFactura = {
        idservicio: servicioSeleccionado.idservicio,
        descripcion: servicioSeleccionado.descripcion,
        valor: servicioSeleccionado.valor,
        cantidad: cantidadServicioSeleccionado,
      };

      // Agregar el servicio al estado local
      setServiciosFactura([...serviciosFactura, servicioFactura]);

      // Crear un objeto JSON con la información del detalle
      const detalleFactura = {
        n_factura: nFactura,
        idtercero: idTercero,
        idservicio: servicioSeleccionado.idservicio,
        descservicio: servicioSeleccionado.descripcion,
        valorservicio: servicioSeleccionado.valor,
        cantidadservicio: cantidadServicioSeleccionado,
      };

      // Convertir el objeto JSON a una cadena JSON
      const detalleFacturaJSON = JSON.stringify(detalleFactura);

      // Enviar la cadena JSON a la cola RabbitMQ
      try {
        const responseDetalle = await fetch('http://localhost:3001/crear-detalles-factura', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: detalleFacturaJSON, // Enviar la cadena JSON
        });

        if (!responseDetalle.ok) {
          throw new Error('Error al crear el detalle de la factura');
        }

        // Actualizar el estado local o realizar cualquier otra acción necesaria después de crear el detalle en el servidor
      } catch (error) {
        console.error('Error al crear el detalle de la factura en el servidor:', error);
      }
    }
  };

  const handleServicioChange = (index, field, value) => {
    if (field === 'cantidadServicio') {
      const updatedServiciosFactura = [...serviciosFactura];
      updatedServiciosFactura[index].cantidad = parseInt(value, 10);
      setServiciosFactura(updatedServiciosFactura);
    }
  };

  const handleEliminar = (id) => {
    const nuevosServiciosFactura = serviciosFactura.filter((servicio) => servicio.idservicio !== id);
    setServiciosFactura(nuevosServiciosFactura);
  };

  const enviarFacturaAlServidor = async () => {
    if (!nFactura || !idTercero || !fecha || valorTotal <= 0 || !numDocumento || !idUsuario) {
      console.error('Por favor, complete todos los campos requeridos antes de guardar la factura.');
      return;
    }
    const facturaData = {
      n_factura: nFactura,
      idtercero: idTercero,
      fecha: fecha,
      valortotal: valorTotal,
      numdocumento: numDocumento,
      idusuario: idUsuario,
    };

    try {
      const responseFactura = await fetch('http://localhost:3001/crear-factura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData),
      });

      if (!responseFactura.ok) {
        throw new Error('Error al crear la factura');
      }

      setNFactura('');
      setIdTercero('');
      setFecha('');
      setValorTotal(0);
      setNumDocumento('');
      setIdUsuario('');
      setServiciosFactura([]);
    } catch (error) {
      console.error('Error al crear la factura o sus detalles:', error);
    }
  };

  return (
    <div className="heading5">
      <Navbar backButton={false} />
      <div className="factura-container">
        <h2>Crear Factura</h2>
        <div className="form-container">
          <div className="form-group">
            <label>Número de Factura:</label>
            <input type="text" value={nFactura} onChange={(e) => setNFactura(e.target.value)} />
          </div>
          <div className="form-group">
            <label>ID Tercero:</label>
            <select value={idTercero} onChange={(e) => setIdTercero(e.target.value)}>
              <option value="">Seleccionar Tercero</option>
              {terceros.map((tercero) => (
                <option key={tercero.idtercero} value={tercero.idtercero}>
                  {tercero.razonsocial}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha:</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Número de Documento:</label>
            <input type="text" value={numDocumento} onChange={(e) => setNumDocumento(e.target.value)} />
          </div>
          <div className="form-group">
            <label>ID Usuario:</label>
            <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)}>
              <option value="">Seleccionar Usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.idusuario} value={usuario.idusuario}>
                  {usuario.usuario}
                </option>
              ))}
            </select>
          </div>
          <button className="guardar-factura" onClick={enviarFacturaAlServidor}>
            Guardar Factura
          </button>
        </div>
        <div className="servicios-container">
          <h3>Servicios:</h3>
          <div className="form-group">
            <label>Seleccionar Servicio:</label>
            <select value={idServicioSeleccionado} onChange={(e) => setIdServicioSeleccionado(e.target.value)}>
              <option value="">Seleccionar Servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.idservicio} value={servicio.idservicio}>
                  {servicio.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad del Servicio:</label>
            <input
              type="number"
              value={cantidadServicioSeleccionado}
              onChange={(e) => setCantidadServicioSeleccionado(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Valor Total:</label>
            <input type="number" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} />
          </div>
          <button className="agregar-servicio" onClick={handleAgregarServicio}>
            Agregar Servicio
          </button>
          <table className="tabla-servicios">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Valor</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFactura.map((servicio, index) => (
                <tr key={index}>
                  <td>{servicio.descripcion}</td>
                  <td>{servicio.valor}</td>
                  <td>
                    <input
                      type="number"
                      value={servicio.cantidad}
                      onChange={(e) => handleServicioChange(index, 'cantidadServicio', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEliminar(servicio.idservicio)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Factura;
