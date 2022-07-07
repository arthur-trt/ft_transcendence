import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsEmpty } from "class-validator";
import {v4 as uuidv4} from 'uuid';

export class UserDto {

	@ApiProperty()
	@IsEmpty()
	id: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	readonly mail: string;
}
