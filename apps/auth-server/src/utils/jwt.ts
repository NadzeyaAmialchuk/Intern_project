const jwt = require('jsonwebtoken');

const generateAccessToken = (userId: string, email: string, phone?: string): string => {
  return jwt.sign({ sub: userId, email, phone }, process.env.JWT_SECRET!, {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  });
};

const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};

module.exports= { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyAccessToken, 
  verifyRefreshToken 
};

export {};