import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card"; // Import Card from Bootstrap
import Form from "react-bootstrap/Form"; // Import Form from Bootstrap
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false); // Toggle for editing personal info
  const [submissions, setSubmissions] = useState([]); // Store user submissions (timeslots)
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fetch user info and submissions on load
  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    setUpdatedUser(userInfo);
    fetchUserSubmissions(); // Fetch user submissions (or timeslots)
  }, []);

  // Fetch user's submissions (or timeslots)
  const fetchUserSubmissions = async () => {
    try {
      const response = await fetch("http://localhost:8081/meeting/slots"); // Adjust this API endpoint if needed
      const data = await response.json();
      console.log("Submissions fetched in profile: ", data);
      setSubmissions(data); // Set the submissions (or timeslots)
    } catch (error) {
      console.error("Error fetching submissions: ", error);
    }
  };

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
    // Example API call to update user info
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

  if (!user)
    return (
      <div>
        <h4>Log in to view this page.</h4>
      </div>
    );

  const { id, email, username, password } = user;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="p-4 shadow-sm">
            <Card.Body className="text-center">
              <h1>{username}</h1>

              {/* User Info */}
              <p className="lead">
                Welcome, <strong>@{username}</strong>!
              </p>
              <p>
                <strong>User ID:</strong> {id}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Password:</strong> {password} (hashed)
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

        {/* User Submissions */}
        <div className="col-md-8 mt-4">
          <Card className="p-4 shadow-sm">
            <h3 className="text-center">Your Submissions</h3>
            {submissions.length > 0 ? (
              <ul className="list-group list-group-flush">
                {submissions.map((submission) => (
                  <li className="list-group-item" key={submission._id}>
                    <strong>{submission.name}</strong>: {submission.startHour} -{" "}
                    {submission.endHour}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center mt-3">You have no submissions yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
