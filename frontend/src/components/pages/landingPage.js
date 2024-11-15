import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import SSULogo from "../SSU.png";

// Adjust the path to match your project structure
import "./landingPage.css"; // Ensure to link the CSS file

const LandingPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Card className="text-center shadow-lg p-4 mb-5 landing-card">
        <Card.Body>
          <Card.Title className="display-4 text-orange font-weight-bold mb-4 d-flex align-items-center justify-content-center">
            <img
              src={SSULogo}
              alt="Salem State University Logo"
              className="mr-3"
              style={{ width: "200px", height: "150px" }} // Adjust size as needed
            />
            Welcome to the Capstone Presentation Portal!
          </Card.Title>
          <hr /> {/* Horizontal line as a page break */}
          <Card.Subtitle className="mb-3 text-blue">
            Manage your Capstone presentation schedule with ease!
          </Card.Subtitle>
          <Card.Text className="lead text-dark mb-4">
            Sign up to register your final project or log in to view and edit
            your presentation details. Go Vikings! 💙🧡
          </Card.Text>
          <div className="d-flex justify-content-around mt-4">
            <Button variant="custom-orange" size="lg" href="/signup">
              Sign Up ✨
            </Button>
            <Button variant="outline-custom-blue" size="lg" href="/login">
              Login 🔑
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LandingPage;
