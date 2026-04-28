exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', function(table) {
    table.increments('id');

    // the actual JWT refresh token string — must be unique
    table.text('token').notNullable().unique();

    // which user this token belongs to
    // CASCADE = delete tokens when user is deleted
    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');

    // when this token expires — used to reject old tokens
    table.timestamp('expires_at').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
};