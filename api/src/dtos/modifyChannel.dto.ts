import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";

export class ModifyChannelDto {

	@IsNotEmpty()
	chanName: string;

	@Length(1)
	@Transform(({ value }: TransformFnParams) => value?.trim())
	password?: string;
}
