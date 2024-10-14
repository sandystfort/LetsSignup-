const mongoose = require("mongoose");

const timeslotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  startHour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  endHour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  description: {
    type: String,
    required: true,
  },
  startMeridiem: {
    type: String,
    required: true,
    enum: ["AM", "PM"],
  },
  endMeridiem: {
    type: String,
    required: true,
    enum: ["AM", "PM"],
  },
});

const Timeslot = mongoose.model("Timeslot", timeslotSchema);

module.exports = Timeslot;
