import { IsNotEmpty, Length } from "class-validator";
import { User } from "src/user/user.entity";



export class ModifyChannelDto {

	@IsNotEmpty()
	chanName: string;

	@Length(1)
	password?: string;
}
