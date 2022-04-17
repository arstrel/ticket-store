import { OrderStatus } from '@sbsoftworks/gittix-common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ChargeAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
}

interface ChargeDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
}

interface ChargeModel extends mongoose.Model<ChargeDoc> {}

const chargeSchema = new mongoose.Schema<ChargeDoc>(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

chargeSchema.set('versionKey', 'version');
chargeSchema.plugin(updateIfCurrentPlugin);

const Charge = mongoose.model<ChargeDoc, ChargeModel>('Charge', chargeSchema);

export { Charge, ChargeAttrs };
