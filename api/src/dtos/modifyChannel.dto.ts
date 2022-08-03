import { IsNotEmpty, Length } from "class-validator";

export class ModifyChannelDto {

	@IsNotEmpty()
	chanName: string;

	@Length(1)
	password?: string;
}
