import { getRabbitChannel } from './rabbitmq.connection';
import { setupUserCreatedBinding } from './bindings';
import { UserCreatedConsumer } from './user-created.consumer';

export async function startRabbitConsumers(
  userCreatedConsumer: UserCreatedConsumer,
) {
  const channel = await getRabbitChannel();

  await setupUserCreatedBinding();

  const queue = 'profile.user-created';

  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      await userCreatedConsumer.handle(event);

      channel.ack(msg);
    } catch (error) {
      console.error('Consumer error:', error);

      channel.nack(msg, false, false);
    }
  });

  console.log('🐇 Listening to queue:', queue);
}
