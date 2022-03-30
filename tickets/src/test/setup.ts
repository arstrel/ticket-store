import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'testsecret';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  function signin(): Promise<string[]>;
}

global.signin = async () => {
  // Build a JWT payload. { id, email }
  const payload = {
    email: 'test@test.com',
    id: '62439b66e77cfb8d0eed9d06',
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build sesson Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it to base64
  const sessionBase64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${sessionBase64}`];
};
