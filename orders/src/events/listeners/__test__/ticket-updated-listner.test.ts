import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrappers";
import { TicketUpdatedListener } from "../ticket-update-listener";
import { TicketUpdatedEvent } from "@ticketingxnie/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })

  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: "new concert",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  // call th onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call th onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});


it ('does not call ack if the event has a skipped version number',async ()=> {
    const {msg,data, listener,ticket} =await setup();
    data.version = 10;

    try{
        await listener.onMessage(data, msg)
    } catch(err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();

})