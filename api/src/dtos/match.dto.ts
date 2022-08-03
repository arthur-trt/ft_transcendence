import { IsNotEmpty } from "class-validator";

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
