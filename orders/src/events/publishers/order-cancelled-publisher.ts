import { OrderCancelledEvent, Publisher, Subjects } from "@ticketingxnie/common";

export class  OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}