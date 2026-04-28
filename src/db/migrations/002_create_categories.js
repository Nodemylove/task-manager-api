exports.up = async function(knex) {
  await knex.schema.createTable('categories', function(table) {
    table.increments('id');

    // category names must be unique — no duplicate "Work" or "Personal"
    table.string('name').notNullable().unique();

    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('categories');
};