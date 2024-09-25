import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const Landingpage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Card
        style={{ width: "35rem" }}
        className="text-center shadow-lg p-3 mb-5 bg-white rounded"
      >
        <Card.Body>
          <Card.Title className="display-4">
            Welcome to the Capstone Presentation Portal!
          </Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            Manage your Capstone presentation schedule with ease
          </Card.Subtitle>
          <Card.Text className="lead">
            Sign up to register your final project or log in to view and edit
            your presentation details.
          </Card.Text>
          <div className="d-flex justify-content-around mt-4">
            <Button variant="primary" size="lg" href="/signup">
              Sign Up
            </Button>
            <Button variant="outline-secondary" size="lg" href="/login">
              Login
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Landingpage;
