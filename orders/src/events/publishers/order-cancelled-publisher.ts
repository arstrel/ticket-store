import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@sbsoftworks/gittix-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
