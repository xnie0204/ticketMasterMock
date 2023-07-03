import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@ticketingxnie/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
