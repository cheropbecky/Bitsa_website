import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userId = "691593eba9c41c23cf3c19b1";

const token = jwt.sign(
  { id: userId },
  process.env.JWT_SECRET,  
  { expiresIn: "7d" }
);

console.log("Generated token:", token);
