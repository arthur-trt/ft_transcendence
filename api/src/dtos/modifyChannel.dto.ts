import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";



export class ModifyChannelDto {

	@IsNotEmpty()
	chanName: string;

	@IsNotEmpty()
	owner: User;

}
