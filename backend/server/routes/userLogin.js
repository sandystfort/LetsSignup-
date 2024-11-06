const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { userLoginValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");
const { generateAccessToken } = require("../utilities/generateToken");

// Login route
router.post("/login", async (req, res) => {
  console.log("Received login request:", req.body); // Log the request data

  // Validate login data
  const { error } = userLoginValidation(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message);
    return res.status(400).send({ message: "Invalid input data." });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await newUserModel.findOne({ email });
    console.log("Found user:", user ? user.email : "No user found"); // Log the user data

    // Check if the user exists
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password attempt for user:", email);
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Generate JSON Web Token if authenticated
    const accessToken = generateAccessToken(
      user._id,
      user.email,
      user.username,
      user.isAdmin
    );
    console.log("Generated access token for user:", user.email);

    // Send back the access token
    res.header("Authorization", accessToken).send({ accessToken });
  } catch (err) {
    console.error("Server error during login:", err.message); // Log the error message
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
