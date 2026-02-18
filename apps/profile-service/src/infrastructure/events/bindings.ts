import { getRabbitChannel } from './rabbitmq.connection';

export async function setupUserCreatedBinding() {
  const channel = await getRabbitChannel();

  const exchange = 'identity.events';
  const queue = 'profile.user-created';

  await channel.assertExchange(exchange, 'topic', { durable: true });

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.bindQueue(queue, exchange, 'user.created');
}

