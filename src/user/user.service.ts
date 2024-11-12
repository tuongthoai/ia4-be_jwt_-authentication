import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/model/user.model';
import * as bcrypt from 'bcrypt';
import { UserSignUpApiRequest } from 'src/auth/dto/UserSignUpApiRequest';
import { UserRefreshToken } from './entities/model/user_refresh_token.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(UserRefreshToken)
    private userRefreshTokenModel: typeof UserRefreshToken,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { username } });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async register(userDto: UserSignUpApiRequest): Promise<User> {
    console.log(userDto);
    const hashedPassword = await bcrypt.hash(userDto.password, 10); // Hash the password
    console.log(hashedPassword);

    return await this.userModel.create({
      ...userDto,
      password: hashedPassword, // Store the hashed password
    });
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ) {
    await this.userRefreshTokenModel.create({
      userId,
      refreshToken,
      expiresAt,
      isRevoked: false, // Set to false by default, as the token is active initially
    });
  }

  async findOneById(userId: string) {
    return this.userModel.findOne({
      where: { id: userId },
      include: [{ model: UserRefreshToken, as: 'refreshToken' }],
    });
  }
}
