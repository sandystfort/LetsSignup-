const mongoose = require("mongoose");

// User schema/model
const newUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      label: "First Name",
    },
    lastName: {
      type: String,
      required: true,
      label: "Last Name",
    },
    username: {
      type: String,
      required: false, // Username is optional
      label: "Username",
    },
    email: {
      type: String,
      required: true,
      label: "Email",
    },
    password: {
      required: true,
      type: String,
      min: 8,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", newUserSchema);
