import request from 'supertest';
import { app } from '../../app';
import { Order, OrderAttr, OrderStatus } from '../../models/order';
import { Ticket, TicketAttr } from '../../models/ticket';
import mongoose from 'mongoose';

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/orders')
    .send({
      ticketId: '62522b31f070cd10b70bfb59',
    })
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ test: 'test ticket', foo: 10 });

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid ticketId is provided', async () => {
  const cookie = global.signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: '',
    })
    .expect(400);
});

it('returns an error if the ticket does not exist', async () => {
  const cookie = global.signin();
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is reserved', async () => {
  const cookie = global.signin();

  const ticket = await Ticket.create<TicketAttr>({
    title: 'test',
    price: 10,
  });

  const order = await Order.create<OrderAttr>({
    userId: '123',
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date(),
  });

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('successfully creates an order with unreserved ticket', async () => {
  const ticket = await Ticket.create<TicketAttr>({
    title: 'concert',
    price: 10,
  });
  const cookie = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits an order:created event');
