  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const zxcvbn = require('zxcvbn'); // Importa la biblioteca
  const { Pool } = require('pg'); // Asegúrate de tener 'pg' instalado
  const amqp = require('amqplib');


  const app = express();
  const port = process.env.PORT || 3001;
  const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto según la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Clintos',
    password: 'postgres',
    port: 5432,
  });

  // Configura la conexión a RabbitMQ
  const rabbitMQConfig = {
    hostname: 'localhost', // Cambia esto con la URL correcta de RabbitMQ
    port: 5672, // Puerto de RabbitMQ
    username: 'guest',
    password: 'guest',
    vhost: '/',
  };


  
  app.use(cors(corsOptions));
  
  // Ruta de inicio de sesión
  app.post('/login', async (req, res) => {
      const { usuario, password } = req.body;
      console.log("llege", usuario, "------", password);
    
      try {
        const result = await pool.query('SELECT * FROM usuario WHERE usuario = $1', [usuario]);
    
        if (result.rows.length === 0) {
          return res.status(401).json({ msg: 'Usuario no encontrado' });
        }
    
        const user = result.rows[0];
        console.log(user);
    
        // Obtén el hash de la contraseña almacenada en la base de datos
        const storedPasswordHash = user.password;
    
        // Compara el hash de la contraseña enviada por el cliente con el hash almacenado
        if (bcrypt.compareSync(password, storedPasswordHash)) {
          console.log("entreeeeee----------");
          const token = jwt.sign({ userId: user.idusuario }, 'secreto', { expiresIn: '1h' });
          console.log(token);
          return res.json({ token });
        } else {
          return res.status(401).json({ msg: 'Contraseña incorrecta' });
        }
      } catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ msg: 'Error en el servidor' });
      }
    });

  // Ruta para crear una nueva factura
  app.post('/crear-factura', async (req, res) => {
    const { n_factura, idtercero, fecha, valortotal, estado, numdocumento, idusuario } = req.body;

    try {
      // Inserta una nueva factura en la tabla "factura"
      const result = await pool.query(
        'INSERT INTO factura (n_factura, idtercero, fecha, valortotal, estado, numdocumento, idusuario) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [n_factura, idtercero, fecha, valortotal, estado, numdocumento, idusuario]
      );

      const newFactura = result.rows[0];
      
      return res.json({ factura: newFactura });
    } catch (error) {
      console.error('Error al crear la factura:', error);
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  });

  // Ruta para crear detalles de factura
  app.post('/crear-detalles-factura', async (req, res) => {
    const { n_factura, idtercero, idservicio, descservicio, valorservicio, cantidadservicio } = req.body; // Accede al primer objeto en el array
    console.log("llegue", n_factura, idtercero, idservicio, descservicio, valorservicio, cantidadservicio);
    try {
      // Inserta los detalles de factura en la tabla "facturadetalle"
      const result = await pool.query(
        'INSERT INTO facturadetalle (n_factura, idtercero, idservicio, descservicio, valorservicio, cantidadservicio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [req.body.n_factura, idtercero, idservicio, descservicio, valorservicio, cantidadservicio]
      );

      const newDetalleFactura = result.rows[0];
      
      return res.json({ detalleFactura: newDetalleFactura });
    } catch (error) {
      console.error('Error al crear los detalles de la factura:', error);
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  });

  // Ruta para obtener los detalles de la factura desde la tabla facturadetalle
  app.get('/facturadetalle', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM facturadetalle');
      const detallesFactura = result.rows;
      return res.json(detallesFactura);
    } catch (error) {
      console.error('Error al obtener los detalles de la factura:', error);
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  });


  // Ruta para obtener los detalles de la factura desde la tabla facturadetalle
  app.get('/factura', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM factura');
      const detallesFactura = result.rows;
      return res.json(detallesFactura);
    } catch (error) {
      console.error('Error al obtener lafactura:', error);
      return res.status(500).json({ msg: 'Error en el servidor' });
    }
  });

// Función para enviar un mensaje a la cola
async function sendMessageToQueue(message) {
  try {
    const connection = await amqp.connect(`amqp://${rabbitMQConfig.hostname}:${rabbitMQConfig.port}/${rabbitMQConfig.vhost}`);
    const channel = await connection.createChannel();
    const queueName = 'EnvioFacturas'; // Reemplaza con el nombre de tu cola

    // Asegúrate de que la cola exista
    await channel.assertQueue(queueName, { durable: false });

    // Envía el mensaje a la cola
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Mensaje enviado a la cola: ${message}`);

    // Cierra la conexión
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error al enviar el mensaje a la cola:', error);
    throw error; // Propaga el error para manejarlo en el controlador de la solicitud HTTP
  }
}

app.post('/send-async-message', async (req, res) => {
  const { message } = req.body;
  console.log(message);
  if (typeof message === 'string' && message.trim() !== '') {
    try {
      // Llama a la función para enviar el mensaje a RabbitMQ
      await sendMessageToQueue(message);
      return res.json({ msg: 'Mensaje asincrónico enviado al backend' });
    } catch (error) {
      console.error('Error al enviar el mensaje a la cola:', error);
      return res.status(500).json({ msg: 'Error al enviar el mensaje a la cola' });
    }
  } else {
    return res.status(400).json({ msg: 'Mensaje no válido' });
  }
});

// Ruta para enviar facturas sincrónicamente
app.post('/enviar-factura-sincrona', (req, res) => {
  try {
    // Aquí puedes realizar tu lógica para enviar facturas sincrónicamente
    // Por ejemplo, podrías procesar las facturas y enviarlas a través de una conexión HTTP o cualquier otro método que necesites.
    
    // Luego, si la operación fue exitosa, puedes enviar una respuesta de éxito.
    return res.json({ msg: 'Facturas enviadas sincrónicamente con éxito' });
  } catch (error) {
    console.error('Error al enviar facturas sincrónicamente:', error);
    return res.status(500).json({ msg: 'Error al enviar facturas sincrónicamente' });
  }
});


  app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
  });
