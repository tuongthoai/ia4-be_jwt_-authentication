import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/model/user.model';
import { UserRefreshToken } from './entities/model/user_refresh_token.model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRefreshToken])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
