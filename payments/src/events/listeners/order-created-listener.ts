import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@sbsoftworks/gittix-common';
import { Message } from 'node-nats-streaming';
import { Order, OrderAttrs } from '../../models/order';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.create<OrderAttrs>({
      userId: data.userId,
      _id: data.id,
      version: data.version,
      price: data.ticket.price,
      status: data.status,
    });

    msg.ack();
  }
}
