import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import "./homePage.css";

const HomePage = () => {
  const [user, setUser] = useState({});
  const [key, setKey] = useState("timeSlots");
  const [slots, setSlots] = useState([]);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [csVsItIndex, setCsVsItIndex] = useState(0);
  const navigate = useNavigate();

  // Array of fun facts
  const funFacts = [
    "Did you know? The first 1GB hard drive, released by IBM in 1980, weighed over 500 pounds and cost over $40,000!",
    "Did you know? The first computer virus was created in 1986 and was called Brain.",
    "Did you know? The first domain name ever registered was Symbolics.com, on March 15, 1985.",
    "Did you know? More than 500 hours of video are uploaded to YouTube every minute.",
    "Did you know? The first electronic computer, ENIAC, weighed more than 27 tons and took up 1800 square feet.",
  ];

  // Array of CS vs IT differences
  const csVsItDifferences = [
    {
      cs: "Computer Science (CS) focuses on software development, algorithms, and the theoretical foundation of computing systems. It involves creating new technologies and solving computational problems.",
      it: "Information Technology (IT) focuses on applying technology solutions to business problems, managing IT infrastructures, and ensuring systems run smoothly in practical environments.",
    },
    {
      cs: "CS often involves research into areas like artificial intelligence, machine learning, and software engineering.",
      it: "IT professionals work on maintaining network infrastructures, securing data, and managing day-to-day operations in a business environment.",
    },
    {
      cs: "CS is about creating and developing software from scratch, including designing algorithms, databases, and systems.",
      it: "IT is about configuring, maintaining, and securing existing systems, and ensuring they run efficiently.",
    },
  ];

  // Rotate fun facts every 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFunFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [funFacts.length]);

  // Rotate CS vs IT differences every 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCsVsItIndex((prevIndex) => (prevIndex + 1) % csVsItDifferences.length);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [csVsItDifferences.length]);

  // Fetch the user's info when the page loads
  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  // Fetch time slots from backend
  useEffect(() => {
    fetch("http://localhost:8081/meeting/slots")
      .then((response) => response.json())
      .then((data) => setSlots(data))
      .catch((error) => console.error("Error fetching slots:", error));
  }, []);

  // Handle deletion of a time slot
  const handleDelete = (id) => {
    fetch(`http://localhost:8081/meeting/slots/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted slot from the state
          setSlots(slots.filter((slot) => slot._id !== id));
        }
      })
      .catch((error) => console.error("Error deleting slot:", error));
  };

  if (!user) {
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

      {/* Add tab navigation to switch between "Time Slots" and "Home" */}
      <Tabs id="home-page-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        {/* Time Slots Tab */}
        <Tab
          eventKey="timeSlots"
          title={<span className="tab-title">Time Slots</span>}
        >
          <div className="tab-content">
            <h4 className="section-title">Newest Presentations</h4>
            <p>Check out the newest capstone presentations below:</p>

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
                        <strong>Time:</strong> {slot.startHour}{" "}
                        {slot.startMeridiem} - {slot.endHour} {slot.endMeridiem}
                        <br />
                        <strong>Location:</strong> TBD
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
              ))}
            </Row>
          </div>
        </Tab>

        {/* Home Tab */}
        <Tab eventKey="home" title={<span className="tab-title">Home</span>}>
          <div className="tab-content">
            {/* Rotating Fun Fact */}
            <div className="fun-box fun-fact">
              <h4>Fun Fact About Computer Science</h4>
              <p>{funFacts[funFactIndex]}</p>{" "}
            </div>

            {/* Capstone Advisors */}
            <div className="fun-box capstone-advisors">
              <h4>Capstone Advisors</h4>
              <ul>
                <li>Dr. Kaur</li>
                <li>Dr. Brockenbrough</li>
              </ul>
            </div>

            {/* Rotating IT vs CS Section */}
            <div className="fun-box it-vs-cs">
              <h4>Difference Between IT and Computer Science</h4>
              <p>
                <strong>Computer Science (CS):</strong>{" "}
                {csVsItDifferences[csVsItIndex].cs}
              </p>
              <p>
                <strong>Information Technology (IT):</strong>{" "}
                {csVsItDifferences[csVsItIndex].it}
              </p>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default HomePage;
