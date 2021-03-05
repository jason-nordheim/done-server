const cors = require("cors");
const winston = require("winston");
const expressWinston = require("express-winston");

/**
 * The logger needs to be added AFTER the express router (app.router) and
 * BEFORE any of your custom error handlers (express.handler).
 * Since express-winston will just log the errors and not handle them, y
 * ou can still use your custom error handler like express.handler,
 * just be sure to put the logger before any of your handlers.
 */
export const winstonLogger = () =>
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    requestWhitelist: [
      "url",
      "headers",
      "method",
      "httpVersion",
      "originalUrl",
      "query",
      "session",
      "body",
    ], // everything
    responseWhitelist: ["body"], // this populates the `res.body` so we can get the response size (not required)
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  });

export const winstonErrorLogger = () =>
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  });
