const jwt = require("jsonwebtoken");
function AdminVerifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.username = decoded.username;
    //verify admin
    if (decoded.role !== "admin") {
      return res.status(401).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = AdminVerifyToken;
