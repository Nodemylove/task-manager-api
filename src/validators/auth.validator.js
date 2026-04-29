const {z}=require('zod');
//registerschema
const registerSchema=z.object({
    email:z.string()
    .email('invalid email formate'),
    password:z
    .string()
    .min(6,'password 6 ka hona chiye bro'),
});
//loginschema
const loginSchema = z.object({
  email:    z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };
