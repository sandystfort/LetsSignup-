import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fetch user info on load
  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo); // Set user to full userInfo object
    setUpdatedUser(userInfo); // Set updatedUser to full userInfo object for edit mode
  }, []);

  // Handle input changes for updating personal info
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  // Submit updated user information
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8081/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      setUser(updatedUser); // Update the user info displayed
      setEditMode(false); // Exit edit mode
    } else {
      console.error("Failed to update user info");
    }
  };

  if (!user.username || !user.email)
    return (
      <div>
        <h4>Log in to view this page.</h4>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="p-4 shadow-sm">
            <Card.Body className="text-center">
              <h1>{user.username}</h1>
              <p className="lead">
                Welcome, <strong>@{user.username}</strong>!
              </p>
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Password:</strong> {user.password ? "****" : "(hashed)"}
              </p>

              {/* Edit Personal Info Form */}
              {editMode ? (
                <Form onSubmit={handleUpdate} className="mt-4">
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={updatedUser.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="mt-3">
                    <Button variant="primary" type="submit" className="me-2">
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <Button
                  className="mt-3 me-2"
                  onClick={() => setEditMode(true)}
                  variant="warning"
                >
                  Edit Personal Info
                </Button>
              )}

              {/* Logout Button */}
              <Button className="mt-3" variant="danger" onClick={handleShow}>
                Log Out
              </Button>

              {/* Modal for logout confirmation */}
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Log Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to log out?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleLogout}>
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
