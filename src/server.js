const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const {
  getAllUsers,
  insertUser,
  getUser,
  updateUser,
} = require("./middleware/knex");
const { winstonLogger, winstonErrorLogger } = require("./middleware/winston");
const { hash } = require("./util/bcrypt");

const MODE = process.env.NODE_ENV || "development";
const PORT = process.env.NODE_ENV || 4000;

const app = express();

// pre-router application
app.use(cors());
app.use(bodyParser.json());

// logging
app.use(winstonLogger);

// routes
app.get("/users", (req, res) => {
  getAllUsers().then((data, err) => {
    if (err) res.status(500).json({ error: err }).send();
    else res.status(200).json({ users: data }).send();
  });
});

app.get("/users/:id", (req, res) => {
  const id = Number.parseInt(req.params.id);

  // make sure there is an id
  if (!id)
    return res
      .status(400)
      .json({ error: "Id required to retrieve a user" })
      .send();

  getUser(id)
    .then((user) => {
      if (!user[0])
        return res
          .status(400)
          .json({ error: `No user found with id: ${id}` })
          .send();
      else return res.status(200).json({ user }).send();
    })
    .catch((error) => res.status(400).json({ error }).send());
});

app.post("/users", (req, res) => {
  if (!req.body.user) {
    res
      .status(400)
      .json({ error: "No User object included in request body" })
      .send();
  }
  const { username, email, password, first_name, last_name } = req.body.user;

  // validate required fields
  if (!username) {
    res
      .status(400)
      .json({ error: "User object is missing required property: 'username'" })
      .send();
  } else if (!email) {
    res
      .status(400)
      .json({ error: "User object is missing required field: 'email'" })
      .send();
  } else if (!password) {
    res
      .status(400)
      .json({ error: "User object is missing required field: 'password'" })
      .send();
  }

  hash(password).then((pwd) => {
    return insertUser({
      username,
      email,
      password_digest: pwd,
      first_name,
      last_name,
    })
      .then((createdUser) => {
        console.debug("userCreated", createdUser);
        res.status(200).json(createdUser).send();
      })
      .catch((error) => {
        if (error.constraint) res.status(400).json({ error }).send();
        else res.status(500).json({ error }).send();
      });
  });
});

app.put("/users/:id", (req, res) => {
  const id = Number.parseInt(req.params.id);

  // make sure there is an id
  if (!id) {
    return res
      .status(400)
      .json({ error: "Id required to update a user", params: req.params.id })
      .send();
  }

  // make sure there is a user associated with the provided id
  return getUser(id)
    .then((user) => {
      const { username, password, first_name, last_name, email } = req.body;
      if (!user[0])
        return res
          .status(400)
          .json({ error: `No user found with id: ${id}` })
          .send();
      else if (!username && !password && !first_name && !last_name && !email)
        return res
          .status(400)
          .json({ error: `Request body contained no fields` })
          .send();
      else
        return hash(password).then((hashedPwd) =>
          updateUser(id, {
            username,
            password_digest: hashedPwd,
            first_name,
            last_name,
            email,
          }).then((userUpdated) => res.status(200).json(userUpdated).send())
        );
    })
    .catch((error) => res.status(400).json({ error }).send());
});

// error logging
app.use(winstonErrorLogger);

app.listen(PORT, () => {
  console.info(`Server started on http://localhost:${PORT} (mode: ${MODE})`);
});
