import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class joinChannelDto {

	@IsNotEmpty()
	readonly chanName: string;

}
