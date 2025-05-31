import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{ name: String, price: Number }],
  portfolio: [{ name: String, price: Number, quantity: Number }],
});

const User = mongoose.model("User", userSchema);
export default User;
