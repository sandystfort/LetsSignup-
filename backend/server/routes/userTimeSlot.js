const express = require("express");
const router = express.Router();
const timeslotModel = require("../models/timeslot");

// Create a new timeslot
router.post("/slots", async (req, res) => {
  console.log("Received timeslot creation request:", req.body); // Log the received data

  const { name, startHour, endHour } = req.body;

  try {
    // Create a new timeslot instance
    const newTimeslot = new timeslotModel({
      name,
      startHour,
      endHour,
    });

    // Save the timeslot in the database
    const savedTimeslot = await newTimeslot.save();
    res.status(201).send(savedTimeslot);
  } catch (err) {
    console.error("Error during timeslot creation:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get all timeslots
router.get("/slots", async (req, res) => {
  try {
    const timeslots = await timeslotModel.find();
    res.status(200).send(timeslots);
  } catch (err) {
    console.error("Error fetching timeslots:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get a timeslot by ID
router.get("/slots/:id", async (req, res) => {
  try {
    const timeslot = await timeslotModel.findById(req.params.id);
    if (!timeslot) {
      return res.status(404).send({ message: "Timeslot not found" });
    }
    res.status(200).send(timeslot);
  } catch (err) {
    console.error("Error fetching timeslot:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Update a timeslot by ID
router.put("/slots/:id", async (req, res) => {
  console.log("Received timeslot update request:", req.body); // Log the received data

  const { name, startHour, endHour } = req.body;

  try {
    const updatedTimeslot = await timeslotModel.findByIdAndUpdate(
      req.params.id,
      { name, startHour, endHour },
      { new: true, runValidators: true }
    );

    if (!updatedTimeslot) {
      return res.status(404).send({ message: "Timeslot not found" });
    }

    res.status(200).send(updatedTimeslot);
  } catch (err) {
    console.error("Error updating timeslot:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Delete a timeslot by ID
router.delete("/slots/:id", async (req, res) => {
  try {
    const deletedTimeslot = await timeslotModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTimeslot) {
      return res.status(404).send({ message: "Timeslot not found" });
    }
    res.status(200).send({ message: "Timeslot deleted successfully" });
  } catch (err) {
    console.error("Error deleting timeslot:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
