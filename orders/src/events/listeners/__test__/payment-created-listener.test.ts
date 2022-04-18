import { natsWrapper } from '../../../nats-wrapper';
import { OrderStatus, PaymentCreatedEvent } from '@sbsoftworks/gittix-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketAttr } from '../../../models/ticket';
import { Order, OrderAttr } from '../../../models/order';
import { PaymentCreatedListener } from '../payment-created-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new PaymentCreatedListener(natsWrapper.client);

  const ticket = await Ticket.create<TicketAttr>({
    title: 'concert',
    price: 10,
    _id: new mongoose.Types.ObjectId().toHexString(),
  });

  const order = await Order.create<OrderAttr>({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket,
  });

  // create a fake data event
  const data: PaymentCreatedEvent['data'] = {
    id: 'test id',
    orderId: order.id,
    stripeId: 'test stripe id',
  };

  // create a fake Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket, order };
};

it('updates the order to complete', async () => {
  const { listener, data, msg, order } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
