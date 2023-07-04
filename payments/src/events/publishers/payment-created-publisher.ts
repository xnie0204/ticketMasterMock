import { Subjects,Publisher, PaymentCreatedEvent } from "@ticketingxnie/common";

export class PayCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}