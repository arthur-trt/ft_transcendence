import { IsEmail, IsNotEmpty } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { ManyToMany } from "typeorm";


export class getPrivateMessageDto
{
	@IsNotEmpty()
	sender : string;

	@IsNotEmpty()
	target : string;
}
