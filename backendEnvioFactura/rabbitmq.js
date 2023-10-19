const amqp = require('amqplib');

async function connectToRabbitMQ() {
  const rabbitMQConfig = {
    hostname: 'localhost', // Cambia con la URL correcta de RabbitMQ si es necesario
    port: 5672, // Puerto de RabbitMQ
    username: 'guest',
    password: 'guest',
    vhost: '/',
  };

  try {
    const connection = await amqp.connect(`amqp://${rabbitMQConfig.hostname}:${rabbitMQConfig.port}/${rabbitMQConfig.vhost}`);
    const channel = await connection.createChannel();

    const queueName = 'EstadoFAcura'; // Reemplaza con el nombre de tu cola

    // Asegúrate de que la cola exista
    await channel.assertQueue(queueName, { durable: false });

    console.log('Conectado a RabbitMQ y listo para consumir mensajes.');

    // Configura el consumidor para procesar mensajes
    channel.consume(queueName, (message) => {
      // Procesa el mensaje aquí
      console.log('Mensaje recibido:', message.content.toString());
    }, { noAck: true });
  } catch (error) {
    console.error('Error al conectar y consumir mensajes desde RabbitMQ:', error);
  }
}

connectToRabbitMQ();
