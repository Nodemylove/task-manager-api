const db = require('../db/knex');
async function findByEmail(email){
    return db('users')
    .where({email})
    .first();
}

//create
async function createUser(email,hashedPassword) {
    const [user]= await db('users')
    .insert({
        email,
        password:hashedPassword,
    })
    .returning(['id','email','created_at']);
    return user;
}
//findbyid
async function findById(id) {
    return db('users')
    .where({id})
    .select('id','email','created_at')
 .first();   
}
module.exports={findByEmail,createUser,findById};