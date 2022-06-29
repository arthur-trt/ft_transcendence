import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Channel } from './channel/channel.entity';
import { ChannelModule } from './channel/channel.module';
import { privateMessage } from './message/message/privateMessage.entity';
import { channelMessage } from './message/message/channelMessage.entity';

@Module({

	imports: [
	  ConfigModule.forRoot({ //<- imported the config module
		  envFilePath: '.env',
		}),
	  UserModule,
		ChannelModule,
	  TypeOrmModule.forRoot({
	  type: 'postgres',
	  host: 'db',
	  port: 5432,
	  username: process.env.POSTGRES_USER,
	  password: process.env.POSTGRES_PASSWORD,
	  database: process.env.POSTGRES_DB,
	  entities: [User, Channel, privateMessage, channelMessage], /* Create tables according to prototype in entities */
	  //entities: [ './car/*.entity.{js,ts}'],
		synchronize: true,
		logging: true
	})],
})

  export class AppModule { }
