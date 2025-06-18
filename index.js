require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./src/models");
const { errorHandler } = require("./src/middlewares/errorhandler");
const router = require("./src/routes");
const coockieParser = require("cookie-parser");
module.exports = app;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(coockieParser());
app.use(express.json());
app.get("/hello", async (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});
app.use("/v1", router);
app.use(errorHandler);
sequelize.sync({ alter: false, force: false }).then(() => {
  app.listen(3000, () => {
    console.log("Server Listening on 3000");
  });
});
