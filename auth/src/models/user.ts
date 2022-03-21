import { Schema, model } from 'mongoose';
import { Password } from '../services/password';

// Properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel {
  email: string;
  password: string;
}

const userSchema = new Schema<UserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // set of properties to help mongoose take doc and turn it into JSON
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password; // we never want to see password property on JSON representation of DB record
        delete ret._id; // normalize id property
      },
      versionKey: false,
    },
  }
);

userSchema.pre('save', async function (done) {
  // event is we just creating a new user this will return true
  // but we need this check to avoid re-hashing the existing password on user edit
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

const User = model<UserModel>('User', userSchema);

export { User, UserAttrs };
