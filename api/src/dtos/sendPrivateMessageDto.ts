import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class sendPrivateMessageDto
{
	@ApiProperty()
	@IsNotEmpty()
	target : string;

	@ApiProperty()
	@IsNotEmpty()
	msg : string;

}
