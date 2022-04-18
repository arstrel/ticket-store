import { natsWrapper } from '../../../nats-wrapper';
import { PaymentCreatedEvent } from '@sbsoftworks/gittix-common';
import { PaymentCreatedPublisher } from '../payment-created-publisher';
import mongoose from 'mongoose';

const setup = async () => {
  const publisher = new PaymentCreatedPublisher(natsWrapper.client);

  const data: PaymentCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    orderId: new mongoose.Types.ObjectId().toHexString(),
    stripeId: new mongoose.Types.ObjectId().toHexString(),
  };

  return { publisher, data };
};

it('emits payment:created event', async () => {
  const { publisher, data } = await setup();

  await publisher.publish(data);

  const params = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(params.id).toEqual(data.id);
  expect(params.orderId).toEqual(data.orderId);
  expect(params.stripeId).toEqual(data.stripeId);
});
