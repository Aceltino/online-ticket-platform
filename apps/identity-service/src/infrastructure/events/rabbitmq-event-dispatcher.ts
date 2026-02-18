import { EventDispatcher } from '../../application/ports/event-dispatcher.port';
import { DomainEvent } from '../../domain/events/domain-event';
import { getRabbitChannel } from './rabbitmq.connection';

export class RabbitMQEventDispatcher implements EventDispatcher {
  async dispatch(event: DomainEvent): Promise<void> {
    const channel = await getRabbitChannel();

    const exchange = 'identity.events';

    await channel.assertExchange(exchange, 'topic', {
      durable: true,
    });

    channel.publish(
      exchange,
      'user.created',
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );

    console.log('📤 Publishing UserCreated event:', event);
  }
}
