import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Protected Profile Route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<{
    username: string;
    name: string;
    lastname: string;
    address?: string;
  }> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('No user ID found in request');
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      address: user.address,
    };
  }
}
