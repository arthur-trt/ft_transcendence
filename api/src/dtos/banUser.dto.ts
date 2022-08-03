import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";

export class banUserDto {

	@IsNotEmpty()
	channel: string;

	@IsNotEmpty()
	toBan: User;
}
