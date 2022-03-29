import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for POST requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({ title: 'test ticket', price: 10 });

  expect(response.status).toEqual(401);
});

it('returns an error is an invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({ title: '', price: 10 });

  expect(response.status).toEqual(400);
});

it('returns an error is an invalid price is provided', async () => {
  const response = await request(app).post('/api/tickets').send({ title: '' });

  expect(response.status).toEqual(400);
});

it('creates a ticket with a valid inputs', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({ title: 'test ticket', price: 10 });

  // expect(response.status).toEqual(200);
});
