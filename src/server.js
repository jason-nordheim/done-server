const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { getAllUsers, insertUser } = require("./config/knex");
const { winstonLogger, winstonErrorLogger } = require("./middleware/winston");
const { hash } = require("./util/bcrypt");

const MODE = process.env.NODE_ENV || "development";
const PORT = process.env.NODE_ENV || 4000;

const app = express();

// pre-router application
app.use(cors());
app.use(bodyParser.json());

// logging
//app.use(winstonLogger);

// routes
app.get("/users", (req, res) => {
  getAllUsers().then((data, err) => {
    if (err) res.status(500).json({ error: err }).send();
    else res.status(200).json({ users: data }).send();
  });
});
app.post("/users", (req, res) => {
  console.log(req);
  if (!req.body.user) {
    res
      .status(400)
      .json({ error: "No User object included in request body" })
      .send();
  }

  // validate required fields
  if (!req.body.user.username) {
    res
      .status(400)
      .json({ error: "User object is missing required property: 'username'" })
      .send();
  } else if (!req.body.user.email) {
    res
      .status(400)
      .json({ error: "User object is missing required field: 'email'" })
      .send();
  } else if (!req.body.user.password) {
    res
      .status(400)
      .json({ error: "User object is missing required field: 'password'" })
      .send();
  }

  hash(req.body.user.password).then((pwd, error) => {
    if (error) res.status(500).json({ error }).send();
    
    res.json({ hashedPwd: pwd });
  });

  //   insertUser(user).then((user, error) => {
  //     if (error) res.status(500).json({ error }).send();
  //     else res.status(200).json({ user });
  //   });
});

// error logging
app.use(winstonErrorLogger);

app.listen(PORT, () => {
  console.info(`Server started on http://localhost:${PORT} (mode: ${MODE})`);
});
