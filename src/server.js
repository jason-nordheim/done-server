const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { UriNotFoundError } = require("./errors/UriNotFoundError");
const { winstonLogger, winstonErrorLogger } = require("./middleware/winston");

const MODE = process.env.NODE_ENV || "development";
const PORT = process.env.NODE_ENV || 4000;

const app = express();

(function setup() {
  // pre-router application
  app.use(cors());
  app.use(bodyParser.json());

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
})();

app.listen(PORT, () => {
  console.info(`Server started on http://localhost:${PORT} (mode: ${MODE})`);
});
