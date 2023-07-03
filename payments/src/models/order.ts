import mongoose from "mongoose";
import {OrderStatus} from '@ticketingxnie/common'
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export {OrderStatus}

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus
  price: number
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
ordersSchema.set('versionKey','version');
ordersSchema.plugin(updateIfCurrentPlugin)
ordersSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", ordersSchema);

export { Order };
