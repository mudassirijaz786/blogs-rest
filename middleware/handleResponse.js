module.exports = (req, res, next) => {
  if (req.statusCode === 200) {
    if (req.data) res.json({ data: req.data, statusCode: 200 });
    else res.json({ message: req.message, statusCode: 200 });
  } else if (req.statusCode === 404) {
    res.status(404).json({ message: req.message, statusCode: 404 });
  } else if (req.statusCode === 400) {
    res
      .status(400)
      .json({ message: req.data ? req.data : req.message, statusCode: 404 });
  }
};
