import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import mongoose from "mongoose";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

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

// it.only('returns a 204 with valid inputs',async ()=> {
//     const userId = new mongoose.Types.ObjectId().toHexString();

//     const order = Order.build({
//         id: new mongoose.Types.ObjectId().toHexString(),
//         userId,
//         version: 0,
//         price: 20,
//         status: OrderStatus.Created
//     });
//     await order.save();

//    const resule = await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin(userId))
//     .send({
//         order: order.id,
//         // a token always works in test mode
//         token: 'tok_visa',
//         orderId: order.id
//     })
//     console.log("ewfew+++++++++++++++++++++++" + process.env.STRIPE_KEY)

//     console.log(resule)



//     const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

//     expect(chargeOptions.source).toEqual('tok_visa');
//     expect(chargeOptions.amount).toEqual(20 * 100);
//     expect(chargeOptions.currency).toEqual('usd')

//     const payment = await Payment.findOne({
//         orderId: order.id,
//     })

//     expect(payment).not.toBeNull();

// })
it("returns a 201 with valid inputs", async () => {
  console.log("JSEFSE+" + process.env.STRIPE_KEY)
  console.log("JSEFSE+" + process.env.JWT_KEY)
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});

