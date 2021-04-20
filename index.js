const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
const root = path.join(__dirname, "client", "build");

/* env variables provided by heroku:
  PORT
  NODE_ENV
*/

if (process.env.NODE_ENV === "production") {
  // serve client app
  app.use(express.static(root));
}

// middlewares
app.use(cors());
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/tasks", require("./routes/tasks"));
app.use("/dashboard", require("./routes/dashboard"));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started");
});
