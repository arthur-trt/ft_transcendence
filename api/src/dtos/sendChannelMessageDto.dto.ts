import { Length } from "class-validator";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { ManyToMany } from "typeorm";



export class sendChannelMessageDto
{
	@IsNotEmpty()
	@Length(3, 50)
	chan: string;

	@IsNotEmpty()
	@Length(1, 250)
	msg: string;
}
