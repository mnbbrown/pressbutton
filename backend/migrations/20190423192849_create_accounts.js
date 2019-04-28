
module.exports.up = (knex) => {
  return knex.schema.createTable('accounts', (table) => {
    table.increments('id');
    table.string('username', 255).notNullable();
  })
};

module.exports.down = (knex) => {
  return knex.schema.dropTable('accounts');
};
