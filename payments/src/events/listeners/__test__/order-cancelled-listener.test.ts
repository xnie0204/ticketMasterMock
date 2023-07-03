import { OrderCancelledEvent, OrderStatus } from "@ticketingxnie/common";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrappers";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'asfs',
        version: 0
    })
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'asfe'
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack:jest.fn()
    }

    return {listener, data,msg, order};
}

it('repicates the order info', async()=> {
    const {listener, data,msg,order} = await setup();

    await listener.onMessage(data,msg)

    const updatedOrder = await Order.findById(data.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it("acks the message", async ()=> {
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg)
    expect(msg.ack).toHaveBeenCalled();
})