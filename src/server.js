const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

// config
const expressConfig = require("../config/express").express;
const mongooseConfig = require("../config/mongoose");
const port = expressConfig.port;
const saltRounds = 10;

// utility functions
const { createToken } = require("../config/jwt");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

/**
 * Create a new User
 */
app.post("/api/users", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    console.log("params", { first_name, last_name, email, password });
    const hashedPass = await bcrypt.hash(password, saltRounds);
    console.log(hashedPass);
    console.log("hash", hashedPass);
    const user = new mongooseConfig.models.user({
      first_name,
      last_name,
      email,
      password_digest: hashedPass,
    });
    const savedUser = await user.save();
    await res.status(201).send(savedUser);
  } catch (error) {
    await res.status(400).json({ error: error.message }).send();
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await mongooseConfig.models.user.findOne({
      email: params.email,
    });
    const validPassword = await bcrypt.compare(
      params.password,
      user.password_digest
    );
    if (validPassword) {
      const token = await createToken({ id: user.id });
      await res.status(200).send(token);
    } else await res.status(401).send();
  } catch (error) {
    await res.status(400).json({ error: error.message }).send();
  }
});
/*
 ************** USERS ROUTER **************
 */

/*
 ************** USERS ROUTER **************
 */

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
