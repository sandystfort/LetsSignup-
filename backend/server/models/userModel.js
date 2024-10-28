const mongoose = require("mongoose");

// User schema/model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      label: "First Name",
      trim: true, // Trim whitespace
    },
    lastName: {
      type: String,
      required: true,
      label: "Last Name",
      trim: true, // Trim whitespace
    },
    username: {
      type: String,
      required: false, // Username is optional
      label: "Username",
      trim: true, // Trim whitespace
    },
    email: {
      type: String,
      required: true,
      label: "Email",
      unique: true, // Ensure unique emails
      trim: true, // Trim whitespace
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
    isAdmin: {
      type: Boolean,
      default: false, // Default is regular user, not admin
    },
  },
  { collection: "users" }
);

// Export the User model
module.exports = mongoose.model("User", userSchema); // Use "User" as the model name
