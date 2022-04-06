import mongoose, { Schema, model } from 'mongoose';

// properties that are required to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// properties that a Ticket has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

const ticketSchema = new Schema<TicketDoc>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
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

const Ticket = model<TicketDoc>('Ticket', ticketSchema);

export { Ticket, TicketAttrs };
