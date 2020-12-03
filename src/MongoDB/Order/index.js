import mongoose from "mongoose";
import { SchemaTimestamps } from "../helper/timestamp";

const addressSchema = mongoose.Schema(
  {
    postal_code: {
      type: String,
      required: true
    },
    city_locality: {
      type: String,
      required: true
    },
    state_province: {
      type: String,
      required: true
    },
    address1: {
      type: String,
      required: true
    },
    address2: {
      type: String,
      required: false,
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const shipmentSchema = mongoose.Schema(
  {
    id: {
      type: String
    },
    status: {
      type: String,
      required: true
    },
    eta: {
      type: Date
    },
    tracking_number: {
      type: String
    },
    tracking_status: {
      type: String
    },
    tracking_url_provider: {
      type: String
    },
    label_url: {
      type: String
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    refunded: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const itemSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.Types.ObjectId,
      ref: "ShopItem",
      required: true
    },
    quantity: {
      type: Number
    }
  },
  { _id: false }
);

const orderSchema = mongoose.Schema(
  {
    buyer_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    orderNumber: {
      type: String,
      required: true
    },
    items: {
      type: [itemSchema],
      required: true
    },
    address: {
      type: addressSchema,
      default: null
    },
    status: {
      type: String,
      required: true
    },
    price_cents: {
      type: Number,
      required: true
    },
    shipping_cents: {
      type: Number,
      required: true
    },
    total_price_cents: {
      type: Number,
      required: true
    },
    purchased_at: {
      type: Date,
      default: null
    },
    shipment: {
      type: shipmentSchema,
      default: null
    },
    orderUpdatedAt: {
      type: Date
    },
    paymentIntentID: {
      type: String,
      required: false
    },
    shippingRateID: {
      type: String,
      required: false
    }
  },
  SchemaTimestamps
);

const OrderModel = mongoose.model("Order", orderSchema, "orders");

export default OrderModel;
