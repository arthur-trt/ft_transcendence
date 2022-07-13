import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class sendPrivateMessageDto
{
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	socketId : string;

	@IsNotEmpty()
	msg : string;

}
