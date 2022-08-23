import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { MatchHistory } from './game.entity';
//import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
//import { AchievementsService } from 'src/achievements/achievements.service';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { GameRelayService } from './game.logic';
import { WSServerModule } from 'src/websocket/wsserver.module';

@Module({
  	controllers: [GameController],
	providers: [GameService, GameRelayService],
	imports: [UserModule, TypeOrmModule.forFeature([MatchHistory, User]), JwtModule, AchievementsModule, forwardRef(() => WSServerModule)],
	exports:[GameService, GameRelayService]
})
export class GameModule {}
