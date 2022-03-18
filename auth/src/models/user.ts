import { Schema, model } from 'mongoose';

// Properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel {
  email: string;
  password: string;
}

const userSchema = new Schema<UserModel>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<UserModel>('User', userSchema);

const user = new User<UserAttrs>({
  email: 'stuff@test.com',
  password: 'testpass#1',
});

export { User, UserAttrs };
