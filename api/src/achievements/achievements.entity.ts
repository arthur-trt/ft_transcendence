import { userInfo } from "os";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Achievements_types {
    TOP1 = "Top 1",
	WINNER = "Winner - Won all matches",
	FIRST = "First victory",
	//LOSER = "Loser - Lost all matches",
	CHANNELLEADER = "Channel Leader - Is owner of at least three channels",
	HALFHALF = "50/50 : Perfect balance between loss and success",
	NOBODYLOVESYOU = "Nobody Loves You - Banned from a channel"
}


@Entity('Achievements')
export class Achievements extends BaseEntity
{
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@Column({
		type: 'text',
	})
	achievement_name: Achievements_types;
}
