import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";

export class sendPrivateMessageDto
{
	@IsNotEmpty()
	to: User;

	@IsNotEmpty()
	msg : string;

}
