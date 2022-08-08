import { IsEmail, IsNotEmpty } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { ManyToMany } from "typeorm";

export class MessageDto {

	@IsNotEmpty()
	sender: User;

	@IsNotEmpty()
	target: User | Channel; //ok pour ca mais estce possible de faire relation;

	@IsNotEmpty()
	message: string;

}
