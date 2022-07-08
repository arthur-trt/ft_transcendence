import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';

@Module({

	imports: [UserModule, JwtModule],
	providers: [ChatGateway],
})
export class ChatModule {}
