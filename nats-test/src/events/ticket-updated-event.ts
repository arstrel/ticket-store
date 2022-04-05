import { Subjects } from './subjects';

export interface TicketUpdatedEvent {
  readonly subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
