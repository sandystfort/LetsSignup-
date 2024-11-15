const express = require("express");
const router = express.Router();
const timeslotModel = require("../models/timeslot");

// Convert time to 24-hour format for easier validation
const convertTo24Hour = (hour, meridiem) => {
  let convertedHour = hour;
  if (meridiem === "PM" && hour !== 12) {
    convertedHour += 12;
  } else if (meridiem === "AM" && hour === 12) {
    convertedHour = 0;
  }
  return convertedHour;
};

// Create a new timeslot
router.post("/slots", async (req, res) => {
  console.log("Received timeslot creation request:", req.body);

  const {
    name,
    projectName,
    startTime,
    endTime,
    description,
    day,
    dayOfMonth,
    month,
    year,
    userId,
    capstoneSupervisor, // New field
  } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required." });
  }

  try {
    const [startHourString, startMeridiem] = startTime.split(" ");
    const [endHourString, endMeridiem] = endTime.split(" ");
    const startHour = parseInt(startHourString.split(":")[0], 10);
    const endHour = parseInt(endHourString.split(":")[0], 10);

    if (!startMeridiem || !endMeridiem) {
      return res
        .status(400)
        .send({ message: "startMeridiem and endMeridiem are required." });
    }

    const start24Hour = convertTo24Hour(startHour, startMeridiem);
    const end24Hour = convertTo24Hour(endHour, endMeridiem);

    if (start24Hour < 7 || end24Hour > 17 || start24Hour >= end24Hour) {
      return res.status(400).send({
        message:
          "Time slots must be between 7 AM and 5 PM with valid start and end times",
      });
    }

    // Check for time conflicts on the same day, month, and year
    const existingSlot = await timeslotModel.findOne({
      dayOfMonth,
      month,
      year,
      $or: [
        {
          $and: [
            { startHour: { $lt: endHour } },
            { endHour: { $gt: startHour } },
            { startMeridiem: startMeridiem },
            { endMeridiem: endMeridiem },
          ],
        },
        {
          $and: [
            { startHour: { $gte: startHour } },
            { endHour: { $lte: endHour } },
            { startMeridiem: startMeridiem },
            { endMeridiem: endMeridiem },
          ],
        },
      ],
    });

    if (existingSlot) {
      return res.status(400).send({
        message: `Time slot conflict: ${existingSlot.startHour} ${existingSlot.startMeridiem} - ${existingSlot.endHour} ${existingSlot.endMeridiem} on ${existingSlot.dayOfMonth} ${existingSlot.month} ${existingSlot.year} is already booked`,
      });
    }

    // Create the new timeslot if no conflict exists
    const newTimeslot = new timeslotModel({
      name,
      projectName,
      startHour,
      endHour,
      description,
      startMeridiem,
      endMeridiem,
      day,
      dayOfMonth,
      month,
      year,
      createdBy: userId,
      capstoneSupervisor, // Add new field
    });

    const savedTimeslot = await newTimeslot.save();
    console.log("Saved Timeslot:", savedTimeslot);

    res.status(201).json(savedTimeslot);
  } catch (err) {
    console.error("Error during timeslot creation:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Fetch all timeslots and populate `createdBy` field with user info
router.get("/slots", async (req, res) => {
  try {
    const slots = await timeslotModel
      .find()
      .populate("createdBy", "username email");
    res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching timeslots:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Fetch a specific timeslot by ID
router.get("/slots/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await timeslotModel
      .findById(id)
      .populate("createdBy", "username email");
    if (!slot) {
      return res.status(404).send({ message: "Slot not found" });
    }
    res.status(200).json(slot);
  } catch (err) {
    console.error("Error fetching slot details:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// DELETE a specific timeslot by ID
router.delete("/slots/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSlot = await timeslotModel.findByIdAndDelete(id);
    if (!deletedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("Error deleting slot:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
