import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import "./homePage.css";

const HomePage = () => {
  const [user, setUser] = useState({});
  const [key, setKey] = useState("personalSlots");
  const [slots, setSlots] = useState([]);
  const [personalSlots, setPersonalSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    console.log("Loaded user info:", userInfo);
  }, []);

  useEffect(() => {
    const fetchSlots = () => {
      if (!user || !user.id) return;

      fetch("http://localhost:8081/meeting/slots")
        .then((response) => response.json())
        .then((data) => {
          setSlots(data);
          const userSlots = data.filter(
            (slot) => slot.createdBy && slot.createdBy.toString() === user.id
          );
          setPersonalSlots(userSlots);
          console.log("Fetched slots:", data);
        })
        .catch((error) => console.error("Error fetching slots:", error));
    };

    fetchSlots();
  }, [user]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      fetch(`http://localhost:8081/meeting/slots/${id}`, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            const updatedSlots = slots.filter((slot) => slot._id !== id);
            const updatedPersonalSlots = personalSlots.filter(
              (slot) => slot._id !== id
            );
            setSlots(updatedSlots);
            setPersonalSlots(updatedPersonalSlots);
            console.log("Slot deleted successfully");
          } else {
            console.error("Failed to delete slot");
          }
        })
        .catch((error) => console.error("Error deleting slot:", error));
    }
  };

  if (!user || !user.id) {
    return (
      <div>
        <h4>Log in to view this page.</h4>
      </div>
    );
  }

  return (
    <div className="home-page-container">
      <h3 className="welcome-message">Welcome, {user.username}</h3>
      <p>Your registered email is {user.email}</p>
      {user.isAdmin && <p className="admin-status">You are an admin.</p>}

      <Tabs id="home-page-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        <Tab eventKey="personalSlots" title="My Time Slots">
          <div className="tab-content">
            <h4 className="section-title">Your Time Slots</h4>
            <Row>
              {personalSlots.length > 0 ? (
                personalSlots.map((slot) => (
                  <Col md={4} key={slot._id}>
                    <Card
                      className="mb-4 shadow-sm"
                      style={{ borderRadius: "10px" }}
                    >
                      <Card.Body>
                        <Card.Title>{slot.name}</Card.Title>
                        <Card.Text>
                          <strong>Date:</strong>{" "}
                          {slot.day ? `${slot.day}, ` : ""}
                          {slot.month ? `${slot.month} ` : ""}
                          {slot.dayOfMonth ? `${slot.dayOfMonth}, ` : ""}
                          {slot.year ? slot.year : ""}
                          <br />
                          <strong>Time:</strong> {slot.startHour}{" "}
                          {slot.startMeridiem} - {slot.endHour}{" "}
                          {slot.endMeridiem}
                          <br />
                          <strong>Project:</strong> {slot.projectName}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="primary"
                            onClick={() => navigate(`/details/${slot._id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(slot._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>No personal time slots available.</p>
              )}
            </Row>
          </div>
        </Tab>

        <Tab eventKey="allSlots" title="View All Meetings">
          <div className="tab-content">
            <h4 className="section-title">All Registered Time Slots</h4>
            <Row>
              {slots.map((slot) => (
                <Col md={4} key={slot._id}>
                  <Card
                    className="mb-4 shadow-sm"
                    style={{ borderRadius: "10px" }}
                  >
                    <Card.Body>
                      <Card.Title>{slot.name}</Card.Title>
                      <Card.Text>
                        <strong>Date:</strong> {slot.day ? `${slot.day}, ` : ""}
                        {slot.month ? `${slot.month} ` : ""}
                        {slot.dayOfMonth ? `${slot.dayOfMonth}, ` : ""}
                        {slot.year ? slot.year : ""}
                        <br />
                        <strong>Time:</strong> {slot.startHour}{" "}
                        {slot.startMeridiem} - {slot.endHour} {slot.endMeridiem}
                        <br />
                        <strong>Project:</strong> {slot.projectName}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/details/${slot._id}`)}
                        >
                          View Details
                        </Button>
                        {(slot.createdBy &&
                          slot.createdBy.toString() === user.id) ||
                        user.isAdmin ? (
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(slot._id)}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default HomePage;
