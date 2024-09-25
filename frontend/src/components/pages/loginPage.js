import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
const url = "http://localhost:8081/user/login";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    const obj = getUserInfo(localStorage.getItem("accessToken"));
    setUser(obj);

    setBgColor(light ? "white" : SECONDARY_COLOR);
    setBgText(light ? "Dark mode" : "Light mode");
  }, [light]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with data:", data);
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;

      console.log("Login successful, received accessToken:", accessToken);
      localStorage.setItem("accessToken", accessToken);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  if (user) {
    navigate("/home");
    return null;
  }

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div
            className="row d-flex justify-content-center align-items-center h-100"
            style={{ background: bgColor }}
          >
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label
                    style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
                  >
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter email"
                    value={data.email}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label
                    style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
                  >
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={data.password}
                    required
                  />
                </Form.Group>
                <Form.Text className="text-muted pt-1">
                  Don't have an account?
                  <Link
                    to="/signup"
                    style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
                  >
                    {" "}
                    Sign up
                  </Link>
                </Form.Text>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    onChange={() => setLight(!light)}
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {bgText}
                  </label>
                </div>

                {error && (
                  <div style={{ color: PRIMARY_COLOR }} className="pt-3">
                    {error}
                  </div>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    background: PRIMARY_COLOR,
                    borderStyle: "none",
                    color: "white",
                  }}
                  className="mt-2"
                >
                  Log In
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
