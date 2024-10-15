const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Initialize dotenv to manage environment variables

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 8081; // Make port configurable

// Suppress Mongoose warning about strictQuery (configure based on your preference)
mongoose.set("strictQuery", true);

// Import routes
const loginRoute = require("./routes/userLogin");
const getAllUsersRoute = require("./routes/userGetAllUsers");
const registerRoute = require("./routes/userSignUp");
const getUserByIdRoute = require("./routes/userGetUserById");
const editUser = require("./routes/userEditUser");
const deleteUser = require("./routes/userDeleteAll");
const timeslotRoute = require("./routes/userTimeSlot");

// Import DB connection
const dbConnection = require("./config/db.config");

// Connect to the database
dbConnection();

// Middleware
app.use(cors({ origin: "*" })); // Enable CORS with wildcard, adjust as needed for security
app.use(express.json()); // Parse incoming requests with JSON payloads

// API routes
app.use("/user", loginRoute);
app.use("/user", registerRoute);
app.use("/user", getAllUsersRoute);
app.use("/user", getUserByIdRoute);
app.use("/user", editUser);
app.use("/user", deleteUser);
app.use("/meeting", timeslotRoute); // Route for timeslot-related functionality

// Start the server
app.listen(SERVER_PORT, () => {
  console.log(
    `The backend service is running on port ${SERVER_PORT} and waiting for requests.`
  );
});
