import { OrderCreatedEvent, Publisher, Subjects} from "@ticketingxnie/common";

export class  OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}