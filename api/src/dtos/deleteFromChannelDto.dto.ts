import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";



export class deleteFromChannelDto {

	@IsNotEmpty()
	chanName: string;

	@IsNotEmpty()
	userToDelete: string;
}
