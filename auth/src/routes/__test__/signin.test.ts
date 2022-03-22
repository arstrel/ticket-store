import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'three@test.com', password: 'testpassword' })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'four@test.com', password: 'testpassword' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'four@test.com', password: 'incorrectpassword' })
    .expect(400);
});

it('responds with a cookie on success', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'five@test.com', password: 'testpassword' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'five@test.com', password: 'testpassword' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
