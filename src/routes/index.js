const router = require("express").Router();

const authRouter = require("./authRoutes");
const resourceRoutes = require("./resourseRoutes");
router.use("/auth", authRouter);
router.use("/resource", resourceRoutes);
module.exports = router;
