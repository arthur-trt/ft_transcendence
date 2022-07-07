import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class sendPrivateMessageDto
{
	@IsNotEmpty()
	target : string;

	@IsNotEmpty()
	msg : string;

}
