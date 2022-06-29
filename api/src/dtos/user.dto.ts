import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDto {
	@IsNotEmpty()
	readonly id: number;

	@IsNotEmpty()
	readonly name: string;

	@IsNotEmpty()
	@IsEmail()
	readonly mail: string;
}
