import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Achievements_types } from "src/achievements/achievements.entity";

export class achievementDto {

	@IsNotEmpty()
	@IsEnum(Achievements_types)
	achievement_name: Achievements_types;

}
