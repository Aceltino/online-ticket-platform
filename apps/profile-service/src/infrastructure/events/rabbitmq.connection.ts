import amqp from 'amqplib';

let channel: amqp.Channel;

export async function getRabbitChannel() {
  if (!channel) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
  }
  return channel;
}
