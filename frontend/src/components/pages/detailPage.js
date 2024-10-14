import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // useParams to get the ID from the URL

const DetailPage = () => {
  const { id } = useParams(); // Get the ID from the route
  const [slot, setSlot] = useState(null);

  // Fetch the slot details based on the ID
  useEffect(() => {
    fetch(`http://localhost:8081/meeting/slots/${id}`)
      .then((response) => response.json())
      .then((data) => setSlot(data))
      .catch((error) => console.error("Error fetching slot details:", error));
  }, [id]);

  if (!slot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Details for {slot.name}</h1>
      <p>
        <strong>Project Name:</strong> {slot.projectName}
      </p>
      <p>
        <strong>Description:</strong> {slot.description}
      </p>
      <p>
        <strong>Time:</strong> {slot.startHour} - {slot.endHour}
      </p>
    </div>
  );
};

export default DetailPage;
