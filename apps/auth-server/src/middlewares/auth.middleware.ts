import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/authRequest.interface";

const { verifyAccessToken } = require('../utils/jwt');

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = verifyAccessToken(token);
    
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      phone: decoded.phone
    };
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
export {};