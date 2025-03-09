const jwt = require("jsonwebtoken");

const userAuthMiddleware = (req, res, next) => {
  try {
    console.log("stuck in user auth");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "JWT token must be provided",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);  // Updated the secret to JWT_USER_SECRET for user authentication

    if (decoded) {
      req.userId = decoded.userId;  // Storing the userId from the decoded token in the request
      console.log(req.userId);
      next();
    } else {
      res.status(403).json({
        message: "You are not signed in",
      });
    }
  } catch (err) {
    res.status(403).json({
      message: err.message,
    });
  }
};

module.exports = userAuthMiddleware;
