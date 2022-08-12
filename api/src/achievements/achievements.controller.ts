import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { achievementDto } from 'src/dtos/achievement.dto';
import { uuidDto } from 'src/dtos/uuid.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {

	constructor(private SuccessService : AchievementsService, private userService : UserService) { }

	@Get()
	@UseGuards(JwtAuthGuard)
	public async getAchievements(@Req() req : Request)
	{
		const user: User = await this.userService.getUserByRequest(req);
		return await this.SuccessService.getAchievements(user);
	}

	@Get(':uuid')
	@UseGuards(JwtAuthGuard)
	public async getAchievementsofUser(@Param() uuid: uuidDto)
	{
		const user: User = await this.userService.getUserByIdentifier(uuid.uuid);
		return await this.SuccessService.getAchievements(user);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	public async createAchievements(@Req() req : Request, @Body() body : achievementDto)
	{
		const type = body.achievement_name;
		const user: User = await this.userService.getUserByRequest(req);
		return await this.SuccessService.createAchievements(user, type);
	}
}
