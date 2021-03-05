// Update with your config settings.
module.exports = {
  development: {
    client: "pg",
    connection: "postgres:///done-dev" /** 3 slashes indicates localhost */,

    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },
};
