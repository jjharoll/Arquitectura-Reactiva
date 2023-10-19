const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn'); // Importa la biblioteca
const { Pool } = require('pg'); // Asegúrate de tener 'pg' instalado

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Clintos',
  password: 'postgres',
  port: 5432,
});

//// CRUD DE TERCEROS /////////////////////////////
  // Ruta para crear un nuevo tercero
app.post('/crear-tercero', async (req, res) => {
  const { razonsocial, nit, dv, tipo } = req.body;

  try {
    // Inserta un nuevo tercero en la tabla "terceros"
    const result = await pool.query(
      'INSERT INTO terceros (razonsocial, nit, dv, tipo, estado) VALUES ($1, $2, $3, $4, true) RETURNING *',
      [razonsocial, nit, dv, tipo]
    );

    const newTercero = result.rows[0];
    
    return res.json({ tercero: newTercero });
  } catch (error) {
    console.error('Error al crear el tercero:', error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Ruta para obtener todos los terceros
app.get('/obtener-terceros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM terceros');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener terceros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un tercero
app.put('/actualizar-tercero/:id', async (req, res) => {
  const { id } = req.params;
  const { razonsocial, nit, dv, tipo } = req.body;

  try {
    const result = await pool.query(
      'UPDATE terceros SET razonsocial = $1, nit = $2, dv = $3, tipo = $4 WHERE idtercero = $5',
      [razonsocial, nit, dv, tipo, id]
    );

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Tercero actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Tercero no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el tercero:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para eliminar un tercero
app.delete('/eliminar-tercero/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM terceros WHERE idtercero = $1', [id]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Tercero eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Tercero no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el tercero:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//// CRUD DE SERVICIOS /////////////////////////////

// Ruta para crear un nuevo servicio
app.post('/crear-servicio', async (req, res) => {
  const { descripcion, valor, estado, cantidad } = req.body;

  try {
    // Inserta un nuevo servicio en la tabla "servicios"
    const result = await pool.query(
      'INSERT INTO servicios (descripcion, valor, estado, cantidad) VALUES ($1, $2, $3, $4) RETURNING *',
      [descripcion, valor, estado, cantidad]
    );

    const newServicio = result.rows[0];

    return res.json({ servicio: newServicio });
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Ruta para obtener todos los servicios
app.get('/obtener-servicios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicios');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un servicio
app.put('/actualizar-servicio/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion, valor, estado, cantidad } = req.body;

  try {
    const result = await pool.query(
      'UPDATE servicios SET descripcion = $1, valor = $2, estado = $3, cantidad = $4 WHERE idservicio = $5',
      [descripcion, valor, estado, cantidad, id]
    );

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Servicio actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Servicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para eliminar un servicio
app.delete('/eliminar-servicio/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM servicios WHERE idservicio = $1', [id]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Servicio eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Servicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


//// CRUD DE USUARIOS /////////////////////////////

// Ruta para crear un nuevo usuario
app.post('/crear-usuario', async (req, res) => {
  const { usuario, password, nombres, apellidos } = req.body;

  try {
    // Hash de la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta un nuevo usuario en la tabla "usuario"
    const result = await pool.query(
      'INSERT INTO usuario (usuario, password, nombres, apellidos) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario, hashedPassword, nombres, apellidos]
    );

    const newUsuario = result.rows[0];

    return res.json({ usuario: newUsuario });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Ruta para obtener todos los usuarios
app.get('/obtener-usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un usuario
app.put('/actualizar-usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario, password, nombres, apellidos } = req.body;

  try {
    // Si se proporciona una nueva contraseña, hasheala antes de actualizarla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'UPDATE usuario SET usuario = $1, password = $2, nombres = $3, apellidos = $4 WHERE idusuario = $5',
        [usuario, hashedPassword, nombres, apellidos, id]
      );
    } else {
      const result = await pool.query(
        'UPDATE usuario SET usuario = $1, nombres = $2, apellidos = $3 WHERE idusuario = $4',
        [usuario, nombres, apellidos, id]
      );
    }

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para eliminar un usuario
app.delete('/eliminar-usuario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM usuario WHERE idusuario = $1', [id]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
