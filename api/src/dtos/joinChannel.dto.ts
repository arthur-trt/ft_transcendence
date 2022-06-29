import { IsEmail, IsNotEmpty } from "class-validator";

export class joinChannelDto {

	@IsNotEmpty()
	readonly chanName: string;

	@IsNotEmpty()
	readonly username: string;
}
