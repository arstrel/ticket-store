import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from '@sbsoftworks/gittix-common';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketAttr } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    await Ticket.create<TicketAttr>({
      title,
      price,
      _id: id,
    });

    msg.ack();
  }
}
