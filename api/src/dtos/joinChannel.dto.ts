import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class joinChannelDto {

	@ApiProperty()
	@IsNotEmpty()
	readonly chanName: string;

}
