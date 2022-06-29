import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty()
	@IsNotEmpty()
	readonly id: number;

	@ApiProperty()
	@IsNotEmpty()
	readonly name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	readonly mail: string;
}
