import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { TicketUpdatedEvent } from './ticket-updated-event';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log('Event data: ', data);

    // Business logic goes here.

    // On successful processing
    msg.ack();
  }
}
