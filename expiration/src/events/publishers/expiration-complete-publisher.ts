import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@sbsoftworks/gittix-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
