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
    // Convert startHour and endHour into a comparable format (24-hour)
    const startTime = startHour; // Already converted to 24-hour format in the frontend
    const endTime = endHour;

    // Check for conflicts with existing timeslots
    const existingSlot = await timeslotModel.findOne({
      $or: [
        {
          startHour: { $lt: endTime, $gte: startTime }, // Existing slot overlaps the start time
        },
        {
          endHour: { $gt: startTime, $lte: endTime }, // Existing slot overlaps the end time
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
