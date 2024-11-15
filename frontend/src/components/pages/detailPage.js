import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";

const DetailPage = () => {
  const { id } = useParams();
  const [slot, setSlot] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/meeting/slots/${id}`
        );
        if (!response.ok) {
          throw new Error("Slot not found");
        }
        const data = await response.json();
        setSlot(data);
      } catch (error) {
        console.error("Error fetching slot details:", error);
        setError(error.message);
      }
    };

    fetchSlotDetails();
  }, [id]);

  if (error) {
    return (
      <Container className="text-center mt-5">
        <h4 className="text-danger">{error}</h4>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );
  }

  if (!slot) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading details...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card
            className="shadow-lg p-4"
            style={{ border: "2px solid #FF6F00" }}
          >
            <Card.Header
              style={{ backgroundColor: "#FF6F00", color: "#ffffff" }}
              className="text-center"
            >
              <h2>Project Details</h2>
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f0f8ff" }}>
              <Card.Title>
                <h3 style={{ color: "#0056b3" }}>{slot.name}</h3>
              </Card.Title>
              <Card.Text>
                <strong>Project Name:</strong>{" "}
                <Badge
                  bg="warning"
                  className="ms-2"
                  style={{ backgroundColor: "#FF6F00", color: "#ffffff" }}
                >
                  {slot.projectName}
                </Badge>
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {slot.description}
              </Card.Text>
              <Card.Text>
                <strong>Capstone Supervisor:</strong>{" "}
                {slot.capstoneSupervisor || "Not specified"}
              </Card.Text>
              <Card.Text>
                <strong>Date:</strong> {slot.day ? `${slot.day}, ` : ""}
                {slot.month ? `${slot.month} ` : ""}
                {slot.dayOfMonth ? `${slot.dayOfMonth}, ` : ""}
                {slot.year ? slot.year : ""}
              </Card.Text>
              <Card.Text>
                <strong>Time:</strong> {slot.startHour} {slot.startMeridiem} -{" "}
                {slot.endHour} {slot.endMeridiem}
              </Card.Text>
              <Button
                variant="outline-primary"
                onClick={() => navigate(-1)}
                style={{
                  backgroundColor: "#FF6F00",
                  borderColor: "#FF6F00",
                  color: "#ffffff",
                }}
              >
                Back
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailPage;
