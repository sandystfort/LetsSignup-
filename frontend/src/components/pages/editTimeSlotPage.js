import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner } from "react-bootstrap";

const EditTimeSlotPage = () => {
  const { id } = useParams();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/meeting/slots/${id}`
        );
        if (!response.ok) throw new Error("Failed to load slot details");

        const data = await response.json();
        // Ensure startTime and endTime are properly initialized
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
      navigate("/");
    } catch (error) {
      console.error("Error updating timeslot:", error);
      setMessage(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSlot((prevSlot) => ({
      ...prevSlot,
      [name]: value,
    }));
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

  return (
    <Container className="mt-5">
      <h2>Edit Timeslot</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={slot.name || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="projectName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            name="projectName"
            value={slot.projectName || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={slot.description || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Start Time */}
        <Form.Group controlId="startTime">
          <Form.Label>Start Time</Form.Label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Form.Control
              type="text"
              placeholder="HH:MM"
              name="startTime"
              value={slot.startTime.split(" ")[0] || ""}
              onChange={(e) =>
                setSlot((prevSlot) => ({
                  ...prevSlot,
                  startTime: `${e.target.value} ${slot.startMeridiem || "AM"}`,
                }))
              }
              required
            />
            <Form.Select
              value={slot.startTime.split(" ")[1] || "AM"}
              onChange={(e) =>
                setSlot((prevSlot) => ({
                  ...prevSlot,
                  startTime: `${slot.startTime.split(" ")[0] || ""} ${
                    e.target.value
                  }`,
                }))
              }
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* End Time */}
        <Form.Group controlId="endTime">
          <Form.Label>End Time</Form.Label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Form.Control
              type="text"
              placeholder="HH:MM"
              name="endTime"
              value={slot.endTime.split(" ")[0] || ""}
              onChange={(e) =>
                setSlot((prevSlot) => ({
                  ...prevSlot,
                  endTime: `${e.target.value} ${slot.endMeridiem || "AM"}`,
                }))
              }
              required
            />
            <Form.Select
              value={slot.endTime.split(" ")[1] || "AM"}
              onChange={(e) =>
                setSlot((prevSlot) => ({
                  ...prevSlot,
                  endTime: `${slot.endTime.split(" ")[0] || ""} ${
                    e.target.value
                  }`,
                }))
              }
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group controlId="capstoneSupervisor">
          <Form.Label>Capstone Supervisor</Form.Label>
          <Form.Control
            type="text"
            name="capstoneSupervisor"
            value={slot.capstoneSupervisor || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Save Changes
        </Button>
        {message && <p className="mt-3 text-success">{message}</p>}
      </Form>
    </Container>
  );
};

export default EditTimeSlotPage;
