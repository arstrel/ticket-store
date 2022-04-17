import { OrderStatus } from '@sbsoftworks/gittix-common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderAttrs } from '../../models/order';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '123',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = await Order.create<OrderAttrs>({
    _id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '123',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = await Order.create<OrderAttrs>({
    _id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    userId,
    price: 10,
    status: OrderStatus.Cancelled,
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: '123',
      orderId: order.id,
    })
    .expect(400);
});
