import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subject";

 export class TicketCreatedListen extends Listener<TicketCreatedEvent> {
  // make it can not change
  readonly subject =  Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log("EVENT DTA", data);
    msg.ack();
  }
}
