const router = require("express").Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticate, authController.getUserByToken);
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
