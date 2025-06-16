require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./src/models");
const { errorHandler } = require("./src/middlewares/errorhandler");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(errorHandler);
sequelize.sync({ alter: false, force: false }).then(() => {
  app.listen(3000, () => {
    console.log("Server Listening on 3000");
  });
});
