import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./createTimeSlot.css";
import getUserInfo from "../../utilities/decodeJwt";

const CreateTimeSlotPage = ({ onCreateSlot }) => {
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startTime, setStartTime] = useState("7:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("Monday");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userInfo = getUserInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const slotData = {
      name,
      projectName,
      startTime,
      endTime,
      description,
      day,
      dayOfMonth,
      month,
      year,
      userId: userInfo.id,
    };

    console.log("Submitting time slot:", slotData); // Check the payload

    const response = await fetch("http://localhost:8081/meeting/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slotData),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(
        `Time Slot created for ${data.name} (${data.projectName}) on ${day}, ${month} ${dayOfMonth}, ${year} from ${startTime} to ${endTime}`
      );
      setShowModal(true);
    } else {
      setMessage("Failed to create time slot");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/home");
  };

  const timeOptions = [
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const monthOptions = [
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
  ];

  const yearOptions = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() + index
  );

  return (
    <div className="create-timeslot-container">
      <h2>Create a Slot</h2>
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
          <label>Day:</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="form-control"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div className="form-group">
          <label>Day of the Month:</label>
          <input
            type="number"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
            min="1"
            max="31"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="form-control"
          >
            {monthOptions.map((monthOption) => (
              <option key={monthOption} value={monthOption}>
                {monthOption}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="form-control"
          >
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-control"
            required
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-control"
            required
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Time Slot
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Time Slot Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your time slot has been created successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateTimeSlotPage;
