import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketAttr } from '../../models/ticket';
import { OrderStatus } from '@sbsoftworks/gittix-common';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = () => {
  const ticket = Ticket.create<TicketAttr>({
    title: 'concert',
    price: 10,
  });

  return ticket;
};

it('requires auth', async () => {
  const ticket = await buildTicket();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .send()
    .expect(401);
});

it("returns an error if the user tries to cancel another person's order", async () => {
  const ticket = await buildTicket();
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('successfully marks the ticket as cancelled', async () => {
  const ticket = await buildTicket();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const ticket = await buildTicket();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
