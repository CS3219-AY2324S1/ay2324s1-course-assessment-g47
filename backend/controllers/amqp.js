const amqp = require('amqplib');

const amqpUrl = process.env.AMQP_URL

const connectToMessageBroker = async () => {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    return channel;
  } catch (error) {
    console.error('Error connecting to the message broker:', error);
    throw error;
  }
};

const setupMatchmakingQueues = async () => {
  const channel = await connectToMessageBroker();

  // Declare a queue for users waiting to be matched
  await channel.assertQueue('waiting_users', { durable: true });

  // Declare a queue for matched pairs
  await channel.assertQueue('matched_pairs', { durable: true });

  return channel;
};

module.exports = { connectToMessageBroker, setupMatchmakingQueues };