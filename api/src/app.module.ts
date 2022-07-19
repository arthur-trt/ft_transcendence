import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Channel } from './channel/channel.entity';
import { ChannelModule } from './channel/channel.module';
import { privateMessage } from './message/privateMessage.entity';
import { channelMessage } from './message/channelMessage.entity';
import { AuthModule } from './auth/auth.module';
// import { ChatModule } from './websocket/chat.module';
import { MatchHistory } from './game/game.entity';
import { GameModule } from './game/game.module';
import { UserActivity } from './user/user_activity.entity';
import { FriendshipsModule } from './friendships/friendships.module';
import { WSServerModule } from './websocket/wsserver.module'

@Module({

	imports: [
	  ConfigModule.forRoot({ //<- imported the config module
		  envFilePath: '.env',
		}),
	  UserModule,
		ChannelModule,
		WSServerModule,
		GameModule,
	  TypeOrmModule.forRoot({
	  type: 'postgres',
	  host: 'db',
	  port: 5432,
	  username: process.env.POSTGRES_USER,
	  password: process.env.POSTGRES_PASSWORD,
	  database: process.env.POSTGRES_DB,
	  entities: [User, Channel, privateMessage, channelMessage, MatchHistory, UserActivity], /* Create tables according to prototype in entities */
	  //entities: [ './car/*.entity.{js,ts}'],
		synchronize: true,
		logging: true
	}),
	  AuthModule,
	  FriendshipsModule],
})

  export class AppModule { }
