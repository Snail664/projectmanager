module.exports = (res, error) => {
  console.log(error);
  return res.status(500).json({ error: "Server Error" });
};
