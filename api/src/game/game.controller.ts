import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateMatchDto, endMatchDto } from 'src/dtos/match.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { MatchHistory } from './game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

	constructor(private gameService : GameService, private userService : UserService) { }

	@Get()
	@ApiOperation({ summary: "Get all matches" })
	public async getGames() : Promise<MatchHistory[]>
	{
		return await this.gameService.getCompleteMatchHistory();
	}

	@Post('new')
	@ApiOperation({ summary: "New matche" })
	public async startMatch(@Body() match : CreateMatchDto) : Promise<MatchHistory[]>
	{
		const user1: User = await this.userService.getUserByIdentifier(match.user1);
		const user2: User = await this.userService.getUserByIdentifier(match.user2);
		await this.gameService.createMatch(user1, user2);
		return this.getGames();
	}

	@Post('end')
	@ApiOperation({ summary: "End matches" })
	public async endMatch(@Body() match : endMatchDto) : Promise<MatchHistory[]>
	{
		if (!match.id)
			throw new HttpException('Must Provide Id', HttpStatus.BAD_REQUEST);
		return await this.gameService.endMatch(match);
	}



}
