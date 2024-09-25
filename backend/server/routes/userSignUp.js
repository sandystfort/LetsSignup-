const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { newUserValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");

router.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body); // Log the received data
  const { error } = newUserValidation(req.body);

  if (error) {
    console.error("Validation error:", error);
    return res.status(400).send({ message: error.errors[0].message });
  }

  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await newUserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new newUserModel({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // Save the user in the database
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
