import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    username: string;
  }> {
    const user = await this.usersService.findOne(username);
    const isPasswordValid = await this.verifyPassword(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const { refreshToken, expiresAt } = await this.generateRefreshToken(user);

    // Optionally, save the hashed refresh token in the database for additional security
    await this.usersService.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      username: user.username,
    };
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(
    user: User,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    const payload = { sub: user.id, username: user.username };
    const refreshToken: string = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    // Calculate the expiration date based on the current date and token lifespan
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return { refreshToken, expiresAt };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const payload = await this.jwtService.verifyAsync(refreshToken);
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username,
      },
      { expiresIn: '15m' },
    );
  }
}
