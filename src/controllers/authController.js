const { Op } = require("sequelize");
const { User } = require("../models");
const response = require("../utils/response");
const bcrypt = require("../utils/bcrypt");
const jwt = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { email, name, password, phone } = req.body;

    if (!email || !name || !password || !phone) {
      return response.badRequest(res, "All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.badRequest(res, "Invalid email format");
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return response.badRequest(res, "Invalid phone number format");
    }
    if (password.length < 8) {
      return response.badRequest(
        res,
        "Password must be at least 8 characters long"
      );
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return response.badRequest(
        res,
        "User with this email or phone already exists"
      );
    }

    const hashedPassword = await bcrypt.hashPassword(password);

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      phone,
    });

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    };

    return response.success(res, "User registered successfully", userResponse);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.badRequest(res, "Email and password are required");
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return response.unauthorized(res, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return response.unauthorized(res, "Invalid credentials");
    }

    const accessToken = jwt.generateToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = jwt.generateToken(
      { id: user.id },
      { expiresIn: "7d" }
    );

    await user.update({ refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };

    return response.success(res, "Login successful", userResponse);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await User.update({ refreshToken: null }, { where: { id: userId } });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return response.success(res, "Logout successful");
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return response.unauthorized(res, "Refresh token is required");
    }
    const decoded = jwt.verifyToken(refreshToken);
    if (!decoded) {
      return response.unauthorized(res, "Invalid refresh token");
    }

    const user = await User.findOne({
      where: {
        id: decoded.id,
        refreshToken,
      },
    });

    if (!user) {
      return response.unauthorized(res, "Invalid refresh token");
    }

    const accessToken = jwt.generateToken({
      id: user.id,
      email: user.email,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.success(res, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return response.badRequest(res, "Email is required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response.success(
        res,
        "If an account exists, a password reset email will be sent"
      );
    }

    const resetToken = jwt.generateToken({ id: user.id }, { expiresIn: "1h" });

    // TODO: Send password reset email with resetToken
    // This would typically involve sending an email with a link containing the reset token

    return response.success(
      res,
      "If an account exists, a password reset email will be sent"
    );
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return response.badRequest(res, "Token and new password are required");
    }

    if (newPassword.length < 8) {
      return response.badRequest(
        res,
        "Password must be at least 8 characters long"
      );
    }

    const decoded = jwt.verifyToken(token);
    if (!decoded) {
      return response.unauthorized(res, "Invalid or expired reset token");
    }

    const user = await User.findOne({
      where: {
        id: decoded.id,
        resetToken: token,
      },
    });

    if (!user) {
      return response.unauthorized(res, "Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hashPassword(newPassword);

    // Update user's password and clear reset token
    await user.update({
      password: hashedPassword,
      resetToken: null,
    });

    return response.success(res, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

const getUserByToken = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return response.unauthorized(res, "Access token is required");
    }

    const decoded = jwt.verifyToken(accessToken);
    if (!decoded) {
      return response.unauthorized(res, "Invalid access token");
    }

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "email", "name", "phone", "createdAt"],
    });
    if (!user) {
      return response.unauthorized(res, "User not found");
    }
    return response.success(
      res,
      "User information retrieved successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  getUserByToken,
};
