import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from '@sbsoftworks/gittix-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
