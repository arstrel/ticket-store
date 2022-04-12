import mongoose, { Schema, model } from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// properties that are required to create an Ticket
interface TicketAttr {
  title: string;
  price: number;
  _id: string;
}

// properties that an Ticket has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new Schema<TicketDoc>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      // ret is the object that is just about to be turned into a JSON
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
// ticketSchema.statics for adding to the model
// and .methods to add to the document
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on

  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = model<TicketDoc>('Ticket', ticketSchema);

export { Ticket, TicketAttr };
