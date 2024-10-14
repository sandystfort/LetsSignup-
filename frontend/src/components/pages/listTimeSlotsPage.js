import React, { useEffect, useState } from "react";
import "./listTimeSlotsPage.css";
const ListTimeSlotsPage = () => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const response = await fetch("http://localhost:8081/meeting/slots");
      const data = await response.json();
      setTimeSlots(data);
    };

    fetchTimeSlots();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:8081/meeting/slots/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setTimeSlots(timeSlots.filter((slot) => slot._id !== id));
    }
  };

  const formatTime = (hour, meridiem) => {
    return `${hour} ${meridiem}`;
  };

  return (
    <div>
      <h2>Time Slots</h2>
      <ul>
        {timeSlots.map((slot) => (
          <li key={slot._id}>
            <strong>Name:</strong> {slot.name} <br />
            <strong>Project Name:</strong> {slot.projectName} <br />
            <strong>Project Description:</strong> {slot.description} <br />
            <strong>Time:</strong>{" "}
            {formatTime(slot.startHour, slot.startMeridiem)} -{" "}
            {formatTime(slot.endHour, slot.endMeridiem)} <br />
            <button onClick={() => handleDelete(slot._id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListTimeSlotsPage;
