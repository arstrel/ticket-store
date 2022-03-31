import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

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

it('returns 400 if the user isprovides an invalid title or price', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 })
    .expect(401);

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'test', price: 20 })
    .expect(401);
});

it('updates the ticket provided valid inputs', async () => {});
