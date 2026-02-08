import { getRabbitChannel } from './rabbitmq.connection';
import { setupUserCreatedBinding } from './bindings';
import { UserCreatedConsumer } from './user-created.consumer';

export async function startRabbitConsumers(
  userCreatedConsumer: UserCreatedConsumer,
) {
  const channel = await getRabbitChannel();

  await setupUserCreatedBinding();

  const queue = 'profile.user-created';

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const event = JSON.parse(msg.content.toString());

    await userCreatedConsumer.handle(event);

    channel.ack(msg);
  });
}
