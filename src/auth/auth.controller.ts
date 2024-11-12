import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserSignInApiRequest } from './dto/UserSignInApiRequest';
import { UserSignUpApiRequest } from './dto/UserSignUpApiRequest';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(
    @Body() userSignInApiRequest: UserSignInApiRequest,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { username, password } = userSignInApiRequest;
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.authService.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.generateJwt(user);
    const { refreshToken, expiresAt } =
      await this.authService.generateRefreshToken(user);

    // Save the refresh token in the database
    await this.userService.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @Post('/register')
  async register(
    @Body() userDto: UserSignUpApiRequest,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.register(userDto);

    const accessToken = await this.authService.generateJwt(user);
    const { refreshToken, expiresAt } =
      await this.authService.generateRefreshToken(user);

    // Save the refresh token in the database
    await this.userService.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/user/refresh-token')
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
  ): Promise<{ access_token: string }> {
    const newAccessToken = await this.authService.refreshToken(refreshToken);
    return { access_token: newAccessToken };
  }
}
