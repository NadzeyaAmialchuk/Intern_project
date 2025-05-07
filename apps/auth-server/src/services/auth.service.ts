import { User } from "../interfaces/user.interface";

const bcrypt = require('bcryptjs');
let jwt = require('../utils/jwt');
const prisma = require('../config/prisma.config');


const register = async (req: any, res: any) => {
  const { username, email, password, phone } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password + salt, 10);

  const user: User = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      password_salt: salt,
      phone
    }
  });

  const token = jwt.generateToken(user.id, user.email, user.phone);
  res.json({ access_token: token });
};

const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  const user: User | null = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password || !user.password_salt) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = bcrypt.compareSync(password + user.password_salt, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.generateToken(user.id, user.email, user.phone);
  res.json({ access_token: token });
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

module.exports = { register, login, getUserMe };

export {};