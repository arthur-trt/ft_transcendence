import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { ManyToMany } from "typeorm";

export class MessageDto {

	@ApiProperty()
	@IsNotEmpty()
	sender: User;

	@ApiProperty()
	@IsNotEmpty()
	target: User | Channel; //ok pour ca mais estce possible de faire relation;

	@ApiProperty()
	@IsNotEmpty()
	message: string;

}
