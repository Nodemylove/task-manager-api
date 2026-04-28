exports.seed=async function(knex){
    await knex('categories').del();
    await knex('categories').insert([
        {name:'Work'},
        {name:'Personal'},
        {name:'Shopping'},
        {name:'Health'},
        {name:'Learning'},
    ]);
    
  console.log('✅ Categories seeded');
};