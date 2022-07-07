import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class newChannelDto {

	/* Channel Name */
	@ApiProperty()
	@IsNotEmpty()
	readonly chanName: string;

}
