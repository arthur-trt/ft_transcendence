import { IsNotEmpty, Length } from "class-validator";

export class newChannelDto {

	/** Channel Name */
	@IsNotEmpty()
	@Length(3, 50)
	readonly chanName: string;

	readonly password?: string;
	readonly private?: boolean;

}
