    import React, { useState, useEffect } from 'react';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
    import './Reportes.css'; // Asegúrate de tener estilos CSS adecuados
    import Navbar from './Navbar';
    import Footer from './Footer';

    function Reportes() {
    const [terceros, setTerceros] = useState([]);
    const [editableIndex, setEditableIndex] = useState(-1);

    // Función para cargar los datos de terceros desde el backend
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

    // Cargar los datos al cargar el componente
    useEffect(() => {
        cargarTerceros();
    }, []);

    // Función para habilitar la edición de un tercero
    const editarTercero = (index) => {
        setEditableIndex(index);
    };

    // Función para guardar los cambios al editar un tercero
    const guardarCambios = async (index) => {
        const terceroEditado = terceros[index];

        try {
        const response = await fetch(`http://localhost:3003/actualizar-tercero/${terceroEditado.idtercero}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(terceroEditado),
        });

        if (response.ok) {
            cargarTerceros(); // Recargar la lista de terceros después de la edición
            setEditableIndex(-1); // Deshabilitar la edición
        } else {
            console.error('Error al actualizar el tercero');
        }
        } catch (error) {
        console.error('Error de red al actualizar el tercero', error);
        }
    };

    // Función para eliminar un tercero
    const eliminarTercero = async (idtercero) => {
        try {
        const response = await fetch(`http://localhost:3001/eliminar-tercero/${idtercero}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            cargarTerceros(); // Recargar la lista de terceros después de la eliminación
        } else {
            console.error('Error al eliminar el tercero');
        }
        } catch (error) {
        console.error('Error de red al eliminar el tercero', error);
        }
    };

    return (
        <div className="heading5">
          <Navbar backButton={false} />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Razón Social</th>
                  <th>NIT</th>
                  <th>DV</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {terceros.map((tercero, index) => (
                  <tr key={tercero.idtercero} className={editableIndex === index ? 'editing' : ''}>
                    <td>
                      {editableIndex === index ? (
                        <input
                          type="text"
                          value={tercero.razonsocial}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setTerceros((prevTerceros) => {
                              const updatedTerceros = [...prevTerceros];
                              updatedTerceros[index].razonsocial = newValue;
                              return updatedTerceros;
                            });
                          }}
                        />
                      ) : (
                        tercero.razonsocial
                      )}
                    </td>
                    <td>{tercero.nit}</td>
                    <td>{tercero.dv}</td>
                    <td>{tercero.tipo}</td>
                    <td>
                      {editableIndex === index ? (
                        <button className="save" onClick={() => guardarCambios(index)}>Guardar</button>
                      ) : (
                        <button className="edit" onClick={() => editarTercero(index)}>Editar</button>
                      )}
                      <button className="delete" onClick={() => eliminarTercero(tercero.idtercero)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
        </div>
      );
    }

    export default Reportes;
