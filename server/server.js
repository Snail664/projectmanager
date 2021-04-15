const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/tasks", require("./routes/tasks"));
app.use("/dashboard", require("./routes/dashboard"));

// start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
