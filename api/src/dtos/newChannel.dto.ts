import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";

export class newChannelDto {

	/** Channel Name */
	@IsNotEmpty()
	@Length(3, 12)
	@Transform(({ value }: TransformFnParams) => value?.trim())
	readonly chanName: string;

	readonly password?: string;
	readonly private?: boolean;

}
