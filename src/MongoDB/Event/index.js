import mongoose from "mongoose";
import { SchemaTimestamps } from "../helper/timestamp";

const attendeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  SchemaTimestamps
);

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    ticketAvailability: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    original_image_url: {
      type: String,
      required: false,
      default: ""
    },
    additional_pictures: {
      type: [String],
      required: false
    },
    signUps: [
      {
        type: attendeeSchema,
        required: false
      }
    ]
  },
  SchemaTimestamps
);

const EventModel = mongoose.model("Event", eventSchema, "events");

export default EventModel;
