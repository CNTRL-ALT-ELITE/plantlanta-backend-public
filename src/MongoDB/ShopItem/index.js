import mongoose from "mongoose";
import { SchemaTimestamps } from "../helper/timestamp";

const shopItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    original_image_url: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  SchemaTimestamps
);

const ShopItemModel = mongoose.model("ShopItem", shopItemSchema, "shopitems");

export default ShopItemModel;
