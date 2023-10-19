// RabbitMQConfig.js

import rabbit from 'rabbit.js';

const rabbitMQConfig = {
  hostname: 'localhost', // Cambia esto con la URL correcta de RabbitMQ
  port: 5672, // Puerto de RabbitMQ
  username: 'guest',
  password: 'guest',
  vhost: '/',
};

const context = rabbit.createContext(`amqp://${rabbitMQConfig.hostname}:${rabbitMQConfig.port}`);
const socket = context.socket('PUSH');

export { socket };
