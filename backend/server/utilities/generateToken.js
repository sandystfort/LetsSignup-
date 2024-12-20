const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAccessToken = (userId, email, username, password, isAdmin) => {
  return jwt.sign(
    { id: userId, email, username, password, isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );
};

module.exports.generateAccessToken = generateAccessToken;
