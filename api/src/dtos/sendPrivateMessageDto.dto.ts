import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class sendPrivateMessageDto
{
	@IsNotEmpty()
	targetUsernameOrId: string;
	
	@IsNotEmpty()
	targetSocketId : string;

	@IsNotEmpty()
	msg : string;

}
