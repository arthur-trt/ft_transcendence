import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { MatchHistory } from './game.entity';
import { GameService } from './game.service';

@Module({
  	controllers: [GameController],
	providers: [GameService],
	imports: [UserModule, TypeOrmModule.forFeature([MatchHistory, User]),
	]
})
export class GameModule {}
