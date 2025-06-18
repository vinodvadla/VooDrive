const router = require("express").Router();
const { authenticate } = require("../middlewares/authMiddleware");
const resourceController = require("../controllers/resourceController");
const { upload } = require("../utils/multer");

router.post("/", upload.single("image"), resourceController.createResource);

module.exports = router;
