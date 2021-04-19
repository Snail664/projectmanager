module.exports = (res, resourcname) => {
  return res.status(404).json({ error: `${resourcname} not found!` });
};
