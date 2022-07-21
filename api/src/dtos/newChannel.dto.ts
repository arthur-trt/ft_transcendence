import { IsNotEmpty } from "class-validator";

export class newChannelDto {

	/** Channel Name */
	@IsNotEmpty()
	readonly chanName: string;

	readonly password?: string;
	readonly private?: boolean;

}
