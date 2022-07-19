import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { achievementDto } from 'src/dtos/achievement.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Achievements_types } from './achievements.entity';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {

	constructor(private SuccessService : AchievementsService, private userService : UserService) { }

	@Get()
	@UseGuards(JwtAuthGuard)
	public async getAchievements(@Req() req : any)
	{
		const user: User = await this.userService.getUserByRequest(req);
		return await this.SuccessService.getAchievements(user);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	public async createAchievements(@Req() req : any, @Body() body : achievementDto)
	{
		const type = body.achievement_name;
		const user: User = await this.userService.getUserByRequest(req);
		return await this.SuccessService.createAchievements(user, type);
	}
}
