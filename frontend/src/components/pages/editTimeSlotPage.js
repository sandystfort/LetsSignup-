import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner, Toast } from "react-bootstrap";
import "./editTimeSlotPage.css";

const EditTimeSlotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/meeting/slots/${id}`
        );
        if (!response.ok) throw new Error("Failed to load slot details");

        const data = await response.json();
        data.startTime = data.startTime || "12:00 AM";
        data.endTime = data.endTime || "12:00 AM";
        setSlot(data);
      } catch (error) {
        console.error("Error fetching slot details:", error);
        setMessage("Failed to load slot details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlotDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8081/meeting/slots/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slot),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update timeslot");
      }

      setMessage("Timeslot updated successfully!");
      setShowToast(true);

      setTimeout(() => {
        navigate("/home");
      }, 5000); // 5-second delay
    } catch (error) {
      console.error("Error updating timeslot:", error);
      setMessage(error.message);
    }
  };

  const handleTimeChange = (timeType, field, value) => {
    setSlot((prevSlot) => {
      const currentTime = prevSlot[timeType].split(" ");
      const timeParts = currentTime[0].split(":");

      if (field === "hour") timeParts[0] = value;
      if (field === "minute") timeParts[1] = value;

      const newTime = `${timeParts.join(":")} ${
        field === "period" ? value : currentTime[1]
      }`;
      return { ...prevSlot, [timeType]: newTime };
    });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (!slot) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{message || "Timeslot not found."}</p>
      </Container>
    );
  }

  const [startHour, startMinute] = slot.startTime.split(" ")[0].split(":");
  const startPeriod = slot.startTime.split(" ")[1];
  const [endHour, endMinute] = slot.endTime.split(" ")[0].split(":");
  const endPeriod = slot.endTime.split(" ")[1];

  return (
    <Container className="form-container mt-5">
      <h2 className="form-title">Edit Timeslot</h2>
      <Form onSubmit={handleSubmit} className="spacious-form">
        <Form.Group controlId="name" className="mb-4">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={slot.name || ""}
            onChange={(e) => setSlot({ ...slot, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="projectName" className="mb-4">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            value={slot.projectName || ""}
            onChange={(e) => setSlot({ ...slot, projectName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={slot.description || ""}
            onChange={(e) => setSlot({ ...slot, description: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="startTime" className="mb-4">
          <Form.Label>Start Time</Form.Label>
          <div className="time-select-group">
            <Form.Select
              value={startHour}
              onChange={(e) =>
                handleTimeChange("startTime", "hour", e.target.value)
              }
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={startMinute}
              onChange={(e) =>
                handleTimeChange("startTime", "minute", e.target.value)
              }
            >
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={startPeriod}
              onChange={(e) =>
                handleTimeChange("startTime", "period", e.target.value)
              }
            >
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group controlId="endTime" className="mb-4">
          <Form.Label>End Time</Form.Label>
          <div className="time-select-group">
            <Form.Select
              value={endHour}
              onChange={(e) =>
                handleTimeChange("endTime", "hour", e.target.value)
              }
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={endMinute}
              onChange={(e) =>
                handleTimeChange("endTime", "minute", e.target.value)
              }
            >
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={endPeriod}
              onChange={(e) =>
                handleTimeChange("endTime", "period", e.target.value)
              }
            >
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group controlId="capstoneSupervisor" className="mb-4">
          <Form.Label>Capstone Supervisor</Form.Label>
          <Form.Control
            type="text"
            value={slot.capstoneSupervisor || ""}
            onChange={(e) =>
              setSlot({ ...slot, capstoneSupervisor: e.target.value })
            }
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="save-button mt-4">
          Save Changes
        </Button>
      </Form>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className="custom-toast"
      >
        <Toast.Header className="toast-header">
          <strong className="me-auto text-success">SUCCESS</strong>
        </Toast.Header>
        <Toast.Body className="toast-body">
          <p>
            <strong>Name:</strong> {slot.name}
          </p>
          <p>
            <strong>Time:</strong> {slot.startTime} - {slot.endTime}
          </p>
          <p>
            <strong>Project Title:</strong> {slot.projectName}
          </p>
          <p>
            <strong>Description:</strong> {slot.description}
          </p>
          <p>
            <strong>capstone Supervisor:</strong> {slot.capstoneSupervisor}
          </p>
        </Toast.Body>
      </Toast>
    </Container>
  );
};

export default EditTimeSlotPage;
