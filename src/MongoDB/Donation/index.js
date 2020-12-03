import mongoose from "mongoose";
import { SchemaTimestamps } from "../helper/timestamp";

const donationSchema = mongoose.Schema({
  donationNumber: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  donateAmount: {
    type: Number,
    required: true
  },
  paymentIntentID: {
    type: String,
    required: false
  }
});

const DonationModel = mongoose.model("Donation", donationSchema, "donations");

export default DonationModel;
