const bcrypt = require('bcryptjs');
const { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');
const { redisClient } = require('../config/redis.config');
const prisma = require('../config/prisma.config');

const register = async (req: any, res: any) => {
  try {
    const { username, email, password, phone } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password + salt, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        password_salt: salt,
        phone
      }
    });

    const accessToken = generateAccessToken(user.id, user.email, user.phone);
    const refreshToken = generateRefreshToken(user.id);
    
    await redisClient.set(`refreshToken:${user.id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60
    });

    res.json({ 
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password || !user.password_salt) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = bcrypt.compareSync(password + user.password_salt, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = generateAccessToken(user.id, user.email, user.phone);
    const refreshToken = generateRefreshToken(user.id);
    
    await redisClient.set(`refreshToken:${user.id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60
    });

    res.json({ 
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const refresh = async (req: any, res: any) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refresh_token);
    const userId = decoded.sub;
    
    const storedRefreshToken = await redisClient.get(`refreshToken:${userId}`);
    
    if (storedRefreshToken !== refresh_token) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true, phone: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user.id, user.email, user.phone);
    const newRefreshToken = generateRefreshToken(user.id);
    
    await redisClient.set(`refreshToken:${user.id}`, newRefreshToken, {
      EX: 7 * 24 * 60 * 60
    });

    res.json({ 
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

const logout = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    await redisClient.del(`refreshToken:${userId}`);
    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

const getUserMe = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      is_verified: true,
      created_at: true
    }
  });
};

module.exports = { 
  register, 
  login, 
  refresh,
  logout,
  getUserMe
};

export {};
