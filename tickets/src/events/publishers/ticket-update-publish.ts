import { Publisher, Subjects, TicketUpdatedEvent} from '@ticketingxnie/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}