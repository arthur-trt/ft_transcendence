import { IsEmail, IsNotEmpty } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { ManyToMany } from "typeorm";


//message/channel/sendMsg/:chanName
//+ @Query sender=<user>&msg=<message>

//privateMessages

export class sendPrivateMessageDto
{
	@IsNotEmpty()
	sender : string;

	@IsNotEmpty()
	target : string;

	@IsNotEmpty()
	msg : string;

}
