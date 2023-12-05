const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bot = require("./bot")

const indexRouter = require("./routes/index");
const { addColors } = require("winston");

const app = express();

(async () => {

  await bot.connect();

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "build")));
  
  app.use("/images", express.static(path.join(__dirname, "bot/images")));
  app.use("/api", indexRouter);
  app.use("/api/bot", bot.server.getRouter())
  app.get("*", (req, res) => {
    // res.status(200).json("OK");
    res.sendFile(path.join(__dirname, "build/index.html"));
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
})();

module.exports = app;
