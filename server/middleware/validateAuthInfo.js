module.exports = function (req, res, next) {
  const { email, name, password } = req.body;

  const isEmailValid = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  };

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json({ error: "Missing Credentials" });
    } else if (!isEmailValid(email)) {
      return res.status(401).json({ error: "Invalid Email" });
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json({ error: "Missing Credentials" });
    } else if (!isEmailValid(email)) {
      return res.json({ error: "Invalid Email" });
    }
  }

  next();
};
