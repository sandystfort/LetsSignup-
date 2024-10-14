import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button, Form } from "react-bootstrap";
import ListTimeSlotsPage from "./listTimeSlotsPage"; // Import your ListTimeSlotsPage component
import getUserInfo from "../../utilities/decodeJwt"; // Import your getUserInfo function to retrieve user data
import "./homePage.css"; // Import custom CSS for fun styling

const HomePage = () => {
  const [user, setUser] = useState({});
  const [key, setKey] = useState("timeSlots"); // Set "Time Slots" as the default tab
  const [comments, setComments] = useState([]); // State for storing comments
  const [newComment, setNewComment] = useState(""); // State for the new comment
  const [questions, setQuestions] = useState([]); // State for storing questions
  const [newQuestion, setNewQuestion] = useState(""); // State for the new question
  const [funFactIndex, setFunFactIndex] = useState(0); // State to store the index of the current fun fact
  const [csVsItIndex, setCsVsItIndex] = useState(0); // State to store the index of the current IT vs CS description

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
    }, 15000); // 15 seconds interval

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [funFacts.length]);

  // Rotate CS vs IT differences every 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCsVsItIndex((prevIndex) => (prevIndex + 1) % csVsItDifferences.length);
    }, 15000); // 15 seconds interval

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [csVsItDifferences.length]);

  // Fetch the user's info when the page loads
  useEffect(() => {
    const userInfo = getUserInfo(); // Fetch user info from local storage or token
    setUser(userInfo); // Set the user info into the state
  }, []);

  // Handle adding new comments
  const handleAddComment = () => {
    setComments([...comments, { text: newComment, author: user.username }]);
    setNewComment("");
  };

  // Handle adding new questions
  const handleAddQuestion = () => {
    setQuestions([...questions, { text: newQuestion, author: user.username }]);
    setNewQuestion("");
  };

  // If no user is found, display a message
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
        {/* Time Slots Tab - Placed First */}
        <Tab
          eventKey="timeSlots"
          title={<span className="tab-title">Time Slots</span>}
        >
          {/* Render ListTimeSlotsPage inside the Time Slots tab */}
          <div className="tab-content">
            <h4 className="section-title">Newest Presentations</h4>
            <p>Check out the newest capstone presentations below:</p>
            <ListTimeSlotsPage />
          </div>
        </Tab>

        {/* Home Tab */}
        <Tab eventKey="home" title={<span className="tab-title">Home</span>}>
          <div className="tab-content">
            {/* Rotating Fun Fact */}
            <div className="fun-box fun-fact">
              <h4>Fun Fact About Computer Science</h4>
              <p>{funFacts[funFactIndex]}</p>{" "}
              {/* Display the current fun fact */}
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

            {/* Question Section */}
            <div className="fun-box question-box">
              <h4>Ask a Question</h4>
              <Form>
                <Form.Group controlId="questionInput">
                  <Form.Control
                    type="text"
                    placeholder="Ask your question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleAddQuestion}>
                  Submit Question
                </Button>
              </Form>

              {/* Display Questions */}
              <div className="mt-4">
                <h4>Questions</h4>
                {questions.length > 0 ? (
                  <ul>
                    {questions.map((q, index) => (
                      <li key={index}>
                        <strong>{q.author}:</strong> {q.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No questions yet. Be the first to ask!</p>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="fun-box comment-box">
              <h4>Leave a Comment</h4>
              <Form>
                <Form.Group controlId="commentInput">
                  <Form.Control
                    type="text"
                    placeholder="Leave a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleAddComment}>
                  Submit Comment
                </Button>
              </Form>

              {/* Display Comments */}
              <div className="mt-4">
                <h4>Comments</h4>
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((c, index) => (
                      <li key={index}>
                        <strong>{c.author}:</strong> {c.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default HomePage;
