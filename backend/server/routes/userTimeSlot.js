const express = require("express");
const router = express.Router();

const timeslotModel = require("../models/timeslot");

// Create a new timeslot
router.post("/slots", async (req, res) => {
  console.log("Received timeslot creation request:", req.body);

  const {
    name,
    projectName,
    startHour,
    endHour,
    description,
    startMeridiem,
    endMeridiem,
  } = req.body;

  try {
    const startTime = startHour;
    const endTime = endHour;

    // Check for conflicts with existing timeslots
    const existingSlot = await timeslotModel.findOne({
      $or: [
        {
          startHour: { $lt: endTime },
          endHour: { $gt: startTime },
        },
        {
          startHour: { $gte: startTime },
          endHour: { $lte: endTime },
        },
      ],
    });

    if (existingSlot) {
      return res.status(400).send({
        message: `Time slot conflict: ${existingSlot.startHour} - ${existingSlot.endHour} is already booked`,
      });
    }

    // If no conflict, create a new timeslot
    const newTimeslot = new timeslotModel({
      name,
      projectName,
      startHour,
      endHour,
      description,
      startMeridiem,
      endMeridiem,
    });

    const savedTimeslot = await newTimeslot.save();
    console.log("Saved Timeslot:", savedTimeslot);

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
  } catch (error) {
    console.error("Error fetching timeslots:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get a single timeslot by ID
router.get("/slots/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const timeslot = await timeslotModel.findById(id);
    if (!timeslot) {
      return res.status(404).send({ message: "Time slot not found" });
    }
    res.status(200).send(timeslot);
  } catch (error) {
    console.error("Error fetching timeslot details:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Delete a timeslot by ID
router.delete("/slots/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSlot = await timeslotModel.findByIdAndDelete(id);
    if (!deletedSlot) {
      return res.status(404).send({ message: "Time slot not found" });
    }
    res.status(200).send({ message: "Time slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting timeslot:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router; // Export the router
