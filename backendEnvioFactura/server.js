const amqp = require('amqplib');
const { Pool } = require('pg');

// Configuración de RabbitMQ
const rabbitMQConfig = {
  hostname: 'localhost', // Cambia con la URL correcta de RabbitMQ si es necesario
  port: 5672, // Puerto de RabbitMQ
  username: 'guest',
  password: 'guest',
  vhost: '/',
  queueName: 'EnvioFacturas', // Reemplaza con el nombre de tu cola
};

// Configuración de la base de datos PostgreSQL
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'Clintos',
  password: 'postgres',
  port: 5432,
};

const pool = new Pool(dbConfig);

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(`amqp://${rabbitMQConfig.hostname}:${rabbitMQConfig.port}/${rabbitMQConfig.vhost}`);
    const channel = await connection.createChannel();

    // Asegúrate de que la cola exista
    await channel.assertQueue(rabbitMQConfig.queueName, { durable: false });

    console.log('Conectado a RabbitMQ y listo para consumir mensajes.');

    // Configura el consumidor para procesar mensajes
    channel.consume(rabbitMQConfig.queueName, async (message) => {
      try {
        const messageContent = message.content.toString();
        const facturaData = JSON.parse(messageContent); // Supongamos que el mensaje es un objeto JSON

        // Insertar los datos de la factura en la tabla facturas_enviadas
        const insertQuery = `
          INSERT INTO facturas_enviadas (n_factura, idtercero, fecha, valortotal, estado, numdocumento, idusuario)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        console.log(insertQuery);
        const values = [
          facturaData.n_factura,
          facturaData.idtercero,
          facturaData.fecha,
          parseFloat(facturaData.valortotal), // Convierte valortotal a float si es necesario
          facturaData.estado,
          facturaData.numdocumento,
          facturaData.idusuario,
        ];

        // Ejecutar la consulta SQL
        await pool.query(insertQuery, values);

        console.log('Factura insertada en la tabla facturas_enviadas:', facturaData);

        // Marcar el mensaje como procesado (opcional)
        channel.ack(message);
      } catch (error) {
        console.error('Error al procesar y guardar el mensaje:', error);

        // Rechazar el mensaje si ocurre un error (opcional)
        channel.reject(message, false);
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Error al conectar y consumir mensajes desde RabbitMQ:', error);
  }
}

// Manejo de errores no capturados en el proceso principal
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Puedes agregar aquí lógica adicional para manejar errores no capturados
});

// Llama a la función para conectar y consumir mensajes
connectToRabbitMQ();