import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { uuidDto } from "./uuid.dto";

export class CreateMatchDto {

	@IsNotEmpty()
	readonly user1?: string;

	@IsNotEmpty()
	readonly user2?: string;
}

export class endMatchDto {

	@IsNotEmpty()
	id : string;

	@IsNotEmpty()
	scoreUser1: number;

	@IsNotEmpty()
	scoreUser2: number;
}
