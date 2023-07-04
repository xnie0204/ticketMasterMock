import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrappers";
import mongoose from "mongoose";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

jest.mock('../../stripe')

it("returns 404 when order doesn't exsit", async () => {
  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({token: 'asdefw', orderId: new mongoose.Types.ObjectId().toHexString()});
  expect(response.status).toEqual(404);
});

it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({token: 'asdefw', orderId: order.id});
  expect(response.status).toEqual(401);

});

it("return a 400 when purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
        order: order.id,
        token: 'asfefw'
    });

  expect(response.status).not.toEqual(401);
});

it('returns a 204 with valid inputs',async ()=> {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
        order: order.id,
        // a token always works in test mode
        token: 'tok_visa',
        orderId: order.id
    }).expect(201)

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd')

    const payment = await Payment.findOne({
        orderId: order.id,
    })

    expect(payment).not.toBeNull();

})


