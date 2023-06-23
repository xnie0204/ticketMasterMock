import { Publisher, Subjects, TicketCreatedEvent } from "@ticketingxnie/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}

