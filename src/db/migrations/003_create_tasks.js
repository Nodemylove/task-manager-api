exports.up = async function(knex) {
  await knex.schema.createTable('tasks', function(table) {
    table.increments('id');
    table.string('title').notNullable();
    table.text('description');
    table.enu('status', ['pending', 'in_progress', 'done']).notNullable().defaultTo('pending');
    table.enu('priority', ['low', 'medium', 'high']).notNullable().defaultTo('medium');

    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');

    // ADD THIS — it was missing from your file
    table.integer('category_id')
         .unsigned()
         .references('id')
         .inTable('categories')
         .onDelete('SET NULL');
         // no .notNullable() — category is optional

    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('tasks');
};