import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner, Toast } from "react-bootstrap";

const EditTimeSlotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString()); // 1 to 12
  const minutes = ["00", "15", "30", "45"]; // Minute options
  const periods = ["AM", "PM"]; // AM/PM options

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

      // Redirect to the homepage after a delay
      setTimeout(() => {
        navigate("/home"); // Redirects to "/home" instead of login
      }, 3000); // 3-second delay
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
    <Container className="mt-5 position-relative">
      <h2>Edit Timeslot</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={slot.name || ""}
            onChange={(e) => setSlot({ ...slot, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="projectName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            name="projectName"
            value={slot.projectName || ""}
            onChange={(e) => setSlot({ ...slot, projectName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={slot.description || ""}
            onChange={(e) => setSlot({ ...slot, description: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group controlId="startTime">
          <Form.Label>Start Time</Form.Label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
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

        <Form.Group controlId="endTime">
          <Form.Label>End Time</Form.Label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
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

        <Form.Group controlId="capstoneSupervisor">
          <Form.Label>Capstone Supervisor</Form.Label>
          <Form.Control
            type="text"
            name="capstoneSupervisor"
            value={slot.capstoneSupervisor || ""}
            onChange={(e) =>
              setSlot({ ...slot, capstoneSupervisor: e.target.value })
            }
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Save Changes
        </Button>
      </Form>

      {/* Toast Notification */}
      <div
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
        }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000} // Matches redirect delay
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Update Success</strong>
          </Toast.Header>
          <Toast.Body>
            <div>
              <p>
                <strong>Updated Name:</strong> {slot.name}
              </p>
              <p>
                <strong>Updated Time:</strong> {slot.startTime} - {slot.endTime}
              </p>
              <p>
                <strong>Updated Project Title:</strong> {slot.projectName}
              </p>
              <p>
                <strong>Updated Description:</strong> {slot.description}
              </p>
            </div>
          </Toast.Body>
        </Toast>
      </div>
    </Container>
  );
};

export default EditTimeSlotPage;
