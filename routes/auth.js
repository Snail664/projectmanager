const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validateAuthInfo = require("../middleware/validateAuthInfo");
const auth = require("../middleware/auth");

// register route
router.post("/register", validateAuthInfo, async (req, res) => {
  try {
    // get data from req.body
    const { name, email, password } = req.body;
    // check if user exists (if user exists throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    // if no such user, bcrypt password
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists!");
    }

    // add salt and hash password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter new user into db
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // generate jwt
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// login route
router.post("/login", validateAuthInfo, async (req, res) => {
  try {
    // get email and password from req.body
    const { email, password } = req.body;
    // check if user exists (if not throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).send("Email or Password is incorrect");
    }

    // check if password in post data as same as db, if not throw error
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!isPasswordValid) {
      return res.status(401).send("Email or Password is incorrect");
    }

    // if same, give jwt token
    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.log(error);
  }
});

// route to check if jwt token is valid
router.get("/verify", auth, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.message(error);
  }
});

module.exports = router;
