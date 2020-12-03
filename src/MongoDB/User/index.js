import mongoose from "mongoose";
import { SchemaTimestamps } from "../helper/timestamp";

const userSchema = mongoose.Schema(
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

const UserModel = mongoose.model("User", userSchema, "users");

export default UserModel;
