const config = require("../config/knexfile")[
  process.env.NODE_ENV || "development"
];
const knex = require("knex")(config);

const getAllUsers = () => knex("users").select();
const getUser = (id) => knex("users").where({ id });

const insertUser = (user) => knex("users").insert(user);

const updateUser = (id, newUser) =>
  knex("users")
    .where({ id })
    .update({ ...newUser, updated_at: new Date().toISOString() });

module.exports = {
  getAllUsers,
  getUser,
  insertUser,
  updateUser,
};
