import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({ title: 'test ticket', price: 10 })
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test ticket', price: 10 });

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const cookie = global.signin();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ price: 10 })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const cookie = global.signin();
  const responseNoPrice = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test' });

  expect(responseNoPrice.status).toEqual(400);

  const responseInvalid = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: -10 });

  expect(responseInvalid.status).toEqual(400);
});

it('creates a ticket with a valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test ticket', price: 10 });

  expect(response.status).toEqual(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  // add in a check to make sure the ticket was saved
});
