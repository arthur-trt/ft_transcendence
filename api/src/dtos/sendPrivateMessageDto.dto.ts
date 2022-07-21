import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";

export class sendPrivateMessageDto
{
	@IsNotEmpty()
	from: string;

	@IsNotEmpty()
	to: User;

	@IsNotEmpty()
	@Length(1, 250)
	msg : string;

}
