import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@sbsoftworks/gittix-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketAttr } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.create<TicketAttr>({
    title: 'test',
    price: 10,
    _id: new mongoose.Types.ObjectId().toHexString(),
  });

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack the message with a version out of order', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
  } catch (err) {}

  // write assertions to make sure ack function is called
  expect(msg.ack).not.toHaveBeenCalled();
});
