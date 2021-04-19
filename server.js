const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

/* env variables provided by heroku:
  PORT
  NODE_ENV
*/

if (process.env.NODE_ENV === "production") {
  // serve client app
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.use(express.static(path.join(__dirname, "client/build")));

// middlewares
app.use(cors());
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/tasks", require("./routes/tasks"));
app.use("/dashboard", require("./routes/dashboard"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// start server
app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
