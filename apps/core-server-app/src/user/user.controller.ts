import { Controller, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
  @Get('/findMe')
  @UseGuards(JwtAuthGuard)
  findMe(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
