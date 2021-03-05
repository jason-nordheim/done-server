exports.up = function (knex) {
  return knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.timestamps(true, true);
    t.string("username", 50).notNullable().unique();
    t.string("email", 255).notNullable().unique();
    t.string("password_digest");
    t.string("first_name", 100);
    t.string("last_name", 100);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
