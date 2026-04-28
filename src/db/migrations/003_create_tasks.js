exports.up = async function(knex) {
  await knex.schema.createTable('tasks', function(table) {
    table.increments('id');

    // title is required — every task must have a name
    table.string('title').notNullable();

    // text = unlimited length — for longer descriptions
    // nullable by default (no .notNullable()) — description is optional
    table.text('description');

    // enum = only these specific values allowed at DB level
    // defaultTo = value used when status not provided on insert
    table.enu('status', ['pending', 'in_progress', 'done'])
         .notNullable()
         .defaultTo('pending');

    table.enu('priority', ['low', 'medium', 'high'])
         .notNullable()
         .defaultTo('medium');

    // FOREIGN KEY: user_id references the id column in the users table
    // unsigned() = positive integers only (matches increments which is unsigned)
    // notNullable() = every task MUST have an owner
    // onDelete('CASCADE') = if the user is deleted, all their tasks are deleted too
    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');
         
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  // tasks must be dropped BEFORE users/categories
  // because tasks has FK references to both — dropping them first would fail
  await knex.schema.dropTableIfExists('tasks');
};
