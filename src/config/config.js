require('dotenv').config();
const config={
    port:process.env.PORT ||3000,
    nodeEnv:process.env.NODE_ENV||'development',
    isProd:process.env.NODE_ENV==='production',
    isDev:process.env.NODE_ENV==='development',
   jwt:{
     secret:         process.env.JWT_SECRET,
    accessExpires:  process.env.JWT_ACCESS_EXPIRES  || '15m',
    refreshSecret:  process.env.JWT_REFRESH_SECRET,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
   }
};
const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
});
module.exports = config;