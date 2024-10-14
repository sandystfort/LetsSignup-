import React, { useState, useEffect } from "react";
import "./createTimeSlot.css";

const CreateTimeSlot = () => {
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMeridiem, setStartMeridiem] = useState("AM");
  const [endHour, setEndHour] = useState("");
  const [endMeridiem, setEndMeridiem] = useState("AM");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [existingSlots, setExistingSlots] = useState([]);

  useEffect(() => {
    const fetchExistingSlots = async () => {
      try {
        const response = await fetch("http://localhost:8081/meeting/slots");
        const data = await response.json();
        setExistingSlots(data);
      } catch (error) {
        console.error("Error fetching existing slots:", error);
      }
    };
    fetchExistingSlots();
  }, []);

  const convertTo24Hour = (hour, meridiem) => {
    let convertedHour = parseInt(hour, 10);
    if (meridiem === "PM" && convertedHour < 12) {
      convertedHour += 12;
    } else if (meridiem === "AM" && convertedHour === 12) {
      convertedHour = 0;
    }
    return convertedHour;
  };

  const checkForConflicts = (start24Hour, end24Hour) => {
    return existingSlots.some((slot) => {
      const slotStart = slot.startHour;
      const slotEnd = slot.endHour;
      return (
        (start24Hour >= slotStart && start24Hour < slotEnd) ||
        (end24Hour > slotStart && end24Hour <= slotEnd) ||
        (start24Hour <= slotStart && end24Hour >= slotEnd)
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start24Hour = convertTo24Hour(startHour, startMeridiem);
    const end24Hour = convertTo24Hour(endHour, endMeridiem);

    if (checkForConflicts(start24Hour, end24Hour)) {
      setMessage(
        "Selected time slot conflicts with an existing booking. Please choose another time."
      );
      return;
    }

    const response = await fetch("http://localhost:8081/meeting/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        projectName,
        startHour: start24Hour,
        endHour: end24Hour,
        description,
        startMeridiem,
        endMeridiem,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(
        `Time Slot created for ${data.name} (${data.projectName}) from ${startHour} ${startMeridiem} to ${endHour} ${endMeridiem}`
      );
    } else {
      setMessage("Failed to create time slot");
    }
  };

  return (
    <div className="create-timeslot-container">
      <h2>Create Time Slot</h2>
      <form onSubmit={handleSubmit} className="timeslot-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="form-control"
            placeholder="Enter project name"
          />
        </div>
        <div className="form-group">
          <label>Project Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
            placeholder="Enter project description"
          />
        </div>
        <div className="form-group">
          <label>Start Hour:</label>
          <div className="input-with-select">
            <input
              type="number"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              min="1"
              max="12"
              required
              className="form-control"
              placeholder="1 - 12"
            />
            <select
              value={startMeridiem}
              onChange={(e) => setStartMeridiem(e.target.value)}
              className="form-control-select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>End Hour:</label>
          <div className="input-with-select">
            <input
              type="number"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              min="1"
              max="12"
              required
              className="form-control"
              placeholder="1 - 12"
            />
            <select
              value={endMeridiem}
              onChange={(e) => setEndMeridiem(e.target.value)}
              className="form-control-select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Time Slot
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateTimeSlot;
