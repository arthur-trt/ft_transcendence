import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsEmpty, isNotEmpty } from "class-validator";
import {v4 as uuidv4} from 'uuid';

export class ModifyUserDto {

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	mail: string;

	@IsNotEmpty()
	fullname: string;

	@IsNotEmpty()
	avatar_url: string;
}
