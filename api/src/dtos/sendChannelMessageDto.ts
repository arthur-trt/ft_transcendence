import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { ManyToMany } from "typeorm";



export class sendChannelMessageDto
{
	@ApiProperty()
	@IsNotEmpty()
	msg: string;
}
