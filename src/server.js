const { request, Router } = require("express");
const express = require("express");
const { UriNotFoundError } = require("./errors/UriNotFoundError");
const { winstonLogger, winstonErrorLogger } = require("./middleware/winston");

const app = express();

(function setup() {
  // pre-router application
  app.use(express.bodyParser());
  app.use(cors());

  // logging
  app.use(winstonLogger);

  // Routing
  const rootRouter = express.Router();
  rootRouter.get("*", (req, res, next) => {
    return next(
      new UriNotFoundError("No route found matching this route", req)
    );
  });

  app.use(rootRouter);

  // error logging
  app.use(winstonErrorLogger);
  app.use(
    express.errorLogger({
      dumpExceptions: true,
      showStack: true,
    })
  );
})();
