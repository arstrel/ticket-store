import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'test', price: 20 })
    .expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
  const userCookie = global.signin();
  const differentUserCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', userCookie)
    .send({ title: 'test', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', differentUserCookie)
    .send({ title: 'changed title', price: 30 })
    .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async () => {
  const userCookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', userCookie)
    .send({ title: 'test', price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({ title: '', price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({ price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({ title: 'test', price: -20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userCookie)
    .send({ title: 'test' })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const userCookie = global.signin();
  const updatedPayload = { title: 'Updated title', price: 40 };

  const createdTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({ title: 'test', price: 10 })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', userCookie)
    .send(updatedPayload)
    .expect(200);

  expect(response.body.title).toEqual(updatedPayload.title);
  expect(response.body.price).toEqual(updatedPayload.price);
});

it('publishes an event', async () => {
  const createdTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 10 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const userCookie = global.signin();
  const updatedPayload = { title: 'Updated title', price: 40 };

  const createdTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({ title: 'test', price: 10 })
    .expect(201);

  const ticket = await Ticket.findById(createdTicket.body.id);

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket!.save();

  const response = await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set('Cookie', userCookie)
    .send(updatedPayload)
    .expect(400);
});
