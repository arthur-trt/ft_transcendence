import { IsEmail, IsNotEmpty, IsEmpty } from "class-validator";
import {v4 as uuidv4} from 'uuid';

export class UserDto {
	@IsEmpty()
	id: uuidv4;

	@IsNotEmpty()
	readonly name: string;

	@IsNotEmpty()
	@IsEmail()
	readonly mail: string;
}
