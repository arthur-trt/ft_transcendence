import { userInfo } from "os";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Achievements_types {
    TOP1 = "Top 1",
    TOP3 = "Top 3",
	TOP10 = "Top 10",
	WINNER = "Winner - Won all matches",
	LOSER = "Loser - Lost all matches",
	ROW3 = "Won three times in a row",
	ROW5 = "Won five times in a row",
	CHANNELLEADER = "Is owner of at least three channels",
	HALFHALF = "Fifty fity",
	NOBODYLOVESYOU = "Banned from a channel"
}



@Entity('Achievements') /** table name */
export class Achievements extends BaseEntity
{

	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@Column({
		type: 'text',
       // enum: Achievements_types,
	})
	achievement_name: Achievements_types;

}
