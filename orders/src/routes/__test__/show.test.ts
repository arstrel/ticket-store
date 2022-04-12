import request from 'supertest';
import { app } from '../../app';
import { OrderDoc } from '../../models/order';
import { Ticket, TicketAttr } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = () => {
  const ticket = Ticket.create<TicketAttr>({
    title: 'concert',
    price: 10,
    _id: new mongoose.Types.ObjectId().toHexString(),
  });

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id });

  // Create two order as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const responseOne = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .send()
    .expect(200);

  expect(responseOne.body.length).toEqual(1);

  // Make sure we only got the orders for User #2
  const responseTwo = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200);

  expect(responseTwo.body.length).toEqual(2);
  expect(
    responseTwo.body.some((order: OrderDoc) => order.id === orderOne.id)
  ).toEqual(true);
  expect(
    responseTwo.body.some((order: OrderDoc) => order.id === orderTwo.id)
  ).toEqual(true);
  expect(responseTwo.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(responseTwo.body[1].ticket.id).toEqual(ticketThree.id);
});

it('fetches the order', async () => {
  // Create a ticket
  const ticketOne = await buildTicket();
  const userOne = global.signin();

  // Make a request to build an order with this ticket
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(orderOne.id);
});

it('returns 401 on attempt to fetch order of another user', async () => {
  // Create a ticket
  const ticket = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the other person's order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(401);
});

it('returns 404 if the order not found', async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin();

  await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', user)
    .send()
    .expect(404);
});
