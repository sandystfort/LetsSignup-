const express = require("express");
const router = express.Router();
const timeslotModel = require("../models/timeslot");

// Create a new timeslot
router.post("/slots", async (req, res) => {
  console.log("Received timeslot creation request:", req.body); // Log the received data

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
    // Log to confirm we received everything
    console.log(
      `Received data: name=${name}, projectName=${projectName}, description=${description}`
    );

    // Create a new timeslot instance
    const newTimeslot = new timeslotModel({
      name,
      projectName,
      startHour,
      endHour,
      description,
      startMeridiem,
      endMeridiem,
    });

    // Save the timeslot in the database
    const savedTimeslot = await newTimeslot.save();

    // Log the saved data to check if it's correct
    console.log("Saved Timeslot:", savedTimeslot);

    // Return all the data back to the frontend
    res.status(201).send({
      name: savedTimeslot.name,
      projectName: savedTimeslot.projectName,
      startHour: savedTimeslot.startHour,
      endHour: savedTimeslot.endHour,
      description: savedTimeslot.description,
      startMeridiem: savedTimeslot.startMeridiem,
      endMeridiem: savedTimeslot.endMeridiem,
    });
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
    const updatedTimeslot = await timeslotModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        projectName,
        startHour,
        endHour,
        description,
        startMeridiem,
        endMeridiem,
      },
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
