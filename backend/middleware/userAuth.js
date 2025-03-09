const jwt = require("jsonwebtoken");

const businessAuthMiddleware = (req, res, next) => {
  try {
    console.log("stuck in auth");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "JWT token must be provided",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_BUSINESS_SECRET);
    if (decoded) {
      req.userId = decoded.userId;
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

module.exports = businessAuthMiddleware;
