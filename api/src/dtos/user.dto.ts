import { IsEmail, IsNotEmpty, IsEmpty } from "class-validator";
import {v4 as uuidv4} from 'uuid';

export class UserDto {
	@IsEmpty()
	id: string;

	@IsNotEmpty()
	readonly name: string;

	@IsNotEmpty()
	@IsEmail()
	readonly mail: string;
}
