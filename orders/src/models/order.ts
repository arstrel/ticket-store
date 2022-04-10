import mongoose, { Schema, model } from 'mongoose';
import { TicketDoc } from './ticket';
import { OrderStatus } from '@sbsoftworks/gittix-common';

// properties that are required to create an Order
interface OrderAttr {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// properties that an Order has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const orderSchema = new Schema<OrderDoc>(
  {
    userId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  },
  {
    toJSON: {
      // ret is the object that is just about to be turned into a JSON
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

const Order = model<OrderDoc>('Order', orderSchema);

export { Order, OrderAttr, OrderStatus, OrderDoc };
