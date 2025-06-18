const { User } = require("../models");
const jwt = require("../utils/jwt");
const response = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return response.unauthorized(res, "Access Token is required !");
    }

    const decoded = jwt.verifyToken(accessToken);

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "email", "name", "phone", "createdAt"],
    });
    if (!user) {
      return response.unauthorized(res, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };
