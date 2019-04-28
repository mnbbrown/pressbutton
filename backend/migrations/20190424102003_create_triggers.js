exports.up = function(knex, Promise) {
  return knex.schema.createTable("triggers", table => {
    table.increments("id");
    table.string("token", 255).notNullable();
    table.string("accountId", 255).notNullable();
    table.string("next", 255).notNullable();
    table.jsonb("config").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("triggers");
};
