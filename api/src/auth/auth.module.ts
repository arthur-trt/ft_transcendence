import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { FortyTwoAuthSrategy } from './auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, FortyTwoAuthSrategy],
  controllers: [FortyTwoAuthController],
})
export class AuthModule {}
