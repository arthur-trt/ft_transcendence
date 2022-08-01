import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsEmpty, isNotEmpty, Length } from "class-validator";
import {v4 as uuidv4} from 'uuid';

export class ModifyUserDto {

	@IsNotEmpty()
	@Length(3, 20)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	mail: string;

	@IsNotEmpty()
	@Length(3, 20)
	fullname: string;

	@IsNotEmpty()
	avatar_url: string;
}
