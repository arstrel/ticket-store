import {
  Publisher,
  TicketUpdatedEvent,
  Subjects,
} from '@sbsoftworks/gittix-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
