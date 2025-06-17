const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRY = "7d"; // or 1h, 30m etc.

module.exports = {
  generateToken: (payload, options = {}) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY, ...options });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },
};
