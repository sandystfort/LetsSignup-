const mongoose = require("mongoose");

const timeslotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectName: { type: String, required: true },
  startHour: { type: Number, required: true, min: 1, max: 12 },
  endHour: { type: Number, required: true, min: 1, max: 12 },
  description: { type: String, required: true },
  startMeridiem: { type: String, required: true, enum: ["AM", "PM"] },
  endMeridiem: { type: String, required: true, enum: ["AM", "PM"] },
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  dayOfMonth: { type: Number, required: true, min: 1, max: 31 },
  month: {
    type: String,
    required: true,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  year: { type: Number, required: true, min: 1900 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  capstoneSupervisor: { type: String, required: true }, // Added field
});

const Timeslot = mongoose.model("Timeslot", timeslotSchema);

module.exports = Timeslot;
