import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";

export class MatchDto {

	@IsNotEmpty()
	readonly scoreUser1: number;

	@IsNotEmpty()
	readonly scoreUser2: number;

	@IsNotEmpty()
	readonly startTime: Date;

	@IsNotEmpty()
	readonly time: Date;

	@IsNotEmpty()
	readonly user1: User;

	@IsNotEmpty()
	readonly user2: User;

}
