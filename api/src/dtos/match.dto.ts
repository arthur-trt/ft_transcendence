import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { uuidDto } from "./uuid.dto";

export class CreateMatchDto {

	@IsNotEmpty()
	readonly user1: string;

	@IsNotEmpty()
	readonly user2: string;
}

export class endMatchDto {

	@IsNotEmpty()
	readonly id : string;

	@IsNotEmpty()
	readonly scoreUser1: number;

	@IsNotEmpty()
	readonly scoreUser2: number;
}
