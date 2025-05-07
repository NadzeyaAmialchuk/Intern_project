const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId: string, email: string, phone?: string): string => {
  return jwt.sign({ sub: userId, email, phone }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });
};

const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

module.exports = { generateToken, verifyToken };

export {};