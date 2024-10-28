const mongoose = require("mongoose");

const timeslotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectName: { type: String, required: true },
  startHour: { type: Number, required: true, min: 1, max: 12 }, // 12-hour format
  endHour: { type: Number, required: true, min: 1, max: 12 }, // 12-hour format
  description: { type: String, required: true },
  startMeridiem: { type: String, required: true, enum: ["AM", "PM"] },
  endMeridiem: { type: String, required: true, enum: ["AM", "PM"] },
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Timeslot = mongoose.model("Timeslot", timeslotSchema);

module.exports = Timeslot;
