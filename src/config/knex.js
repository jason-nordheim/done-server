const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(config);

const getAllUsers = () => knex("users").select();

const insertUser = (user) => knex("users").insert(user).returning("*")[0];

module.exports = {
  getAllUsers,
  insertUser,
};
