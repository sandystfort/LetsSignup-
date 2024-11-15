import React, { useEffect } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";
import "./pages/navbar.css";

export default function Navbar() {
  useEffect(() => {
    getUserInfo(); // You can still call getUserInfo() if needed for side effects
  }, []);

  return (
    <ReactNavbar className="custom-navbar">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Start</Nav.Link>
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/CreateTimeSlot">Pick a Slot</Nav.Link>
        </Nav>
      </Container>
    </ReactNavbar>
  );
}
