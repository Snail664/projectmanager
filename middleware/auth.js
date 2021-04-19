const jwt = require("jsonwebtoken");
require("dotenv").config();

// middleware function to check if jwt token is valid
// adds "user" key containing user's id to req object if token is valid
module.exports = async (req, res, next) => {
  try {
    // get token from req headers
    const token = req.header("token");

    if (!token) {
      return res.status(403).json({ error: "Forbidden, permission denied" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload.user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Forbidden, permission denied" });
  }
};
