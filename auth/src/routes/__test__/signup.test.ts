import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'testpassword' })
    .expect(201);
});

it('returns a 400 on invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'testest.com', password: 'testpassword' })
    .expect(400);
});

it('returns a 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 't' })
    .expect(400);
});

it('dissallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'one@test.com', password: 'testpass' })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'one@test.com', password: 'testpass' })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'two@test.com', password: 'testpass' })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
