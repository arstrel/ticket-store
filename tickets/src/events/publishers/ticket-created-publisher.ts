import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@sbsoftworks/gittix-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
