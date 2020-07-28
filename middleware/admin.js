const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      message: "Access denied, no token provided. Please provide auth token.",
    });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    if (!req.user.isAdmin) {
      res.status(403).json({ message: "You are not an admin" });
    } else {
      next();
    }
  } catch (ex) {
    res.status(400).json({ error: "Invalid token.", ex });
  }
};
