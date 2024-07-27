import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  {
    name: String,
    username: String,
    email: String,
    phone: Number
  }
);

export { User };
