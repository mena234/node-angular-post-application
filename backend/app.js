const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const fileMiddleware = require("./middlewares/file");

mongoose
  .connect("mongodb://localhost:27017/angular-node")
  .then((result) => console.log(result))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api/posts", fileMiddleware.multer, postsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;
