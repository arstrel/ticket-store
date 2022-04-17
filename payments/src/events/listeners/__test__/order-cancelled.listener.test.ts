import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@sbsoftworks/gittix-common';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderAttrs } from '../../../models/order';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const id = new mongoose.Types.ObjectId().toHexString();

  const order = await Order.create<OrderAttrs>({
    _id: id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
  });

  const data: OrderCancelledEvent['data'] = {
    id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, id };
};

it('cancels an order upon receiving order:cancelled event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('throws an error upon receiving event with out of order version', async () => {
  const { listener, msg, id } = await setup();

  const data: OrderCancelledEvent['data'] = {
    id,
    version: 3,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return;
  }

  throw new Error('Should not get here');
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
