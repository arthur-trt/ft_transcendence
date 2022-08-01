import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";

export class addToPrivateRoomDto {

	@IsNotEmpty()
	readonly user: User;

	@IsNotEmpty()
	readonly chanName: string;

}
