import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Achievements, Achievements_types } from './achievements.entity';

@Injectable()
export class AchievementsService {


	constructor (@InjectRepository(Achievements) private successRepo : Repository<Achievements>) {}

	public async createAchievements(user: User, type : Achievements_types)
	{
		await this.successRepo.save({
			user: user,
			achievement_list: type
		});
		return this.successRepo.find( { relations: ['user'] });
	}

	public async getAchievements(user: User)
	{
		return await this.successRepo.find({
			select:["achievement_list"],
			where: {
				user: { id: user.id },
			},
			});
	}

	public async hasAchievement(achievement: Achievements_types, user: User)
	{
		const achiev = this.getAchievements(user);
		for (const i in achiev)
		{
			if (achiev[i] == achievement)
				return true;
		}
		return false;
	}

}
