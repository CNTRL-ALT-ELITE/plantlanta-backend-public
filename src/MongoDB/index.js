import mongoose from "mongoose";
import { MongoConnectionURI } from "../config/mongodb";

export const connectToMongoDB = () => {
  return mongoose.connect(MongoConnectionURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
};
