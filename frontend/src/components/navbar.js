import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";
import "./pages/navbar.css"; // Ensure the CSS path is correct

// Here, we display our Navbar
export default function Navbar() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <ReactNavbar className="custom-navbar">
      {" "}
      {/* Apply custom class */}
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
