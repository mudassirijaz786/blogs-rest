const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // : [COOKIE BASED AUTH]
  // // const { token } = req.cookies;
  // //   if (!token) {
  // //       return clearTokenAndNext();
  // //   }
  // if (!config.get("requiresAuth")) return next();

  // const { token } = req.cookies;
  // if (!token)
  //   return res.status(401).json({
  //     message: "Access denied, no token provided. Please provide auth token.",
  //   });

  // try {
  //   const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  //   req.user = decoded;
  //   next();
  // } catch (ex) {
  //   res.status(400).json({ error: "Invalid token." });
  // }
  // : [HEADER BASED AUTH]

  if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      message: "Access denied, no token provided. Please provide auth token.",
    });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};
