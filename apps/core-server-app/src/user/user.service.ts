import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async findMe(token: string) {
    if (token) {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new InternalServerErrorException('JWT secret not configured');
      }
      const isUser = jwt.verify(token, secret) as {
        sub: string;
      };
      const id = isUser.sub;
      return await this.prisma.user.findUnique({
        where: { id },
      });
    }
  }

  async findOne(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
