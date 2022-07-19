import { userInfo } from "os";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Achievements_types {
    TOP1 = "Top 1",
    TOP3 = "Top 3",
	TOP10 = "Top 10",
	WINNER = "Winner - Won all matches",
	LOSER = "Loser - Lost all matches",
	ROW3 = "Row 3 - Won three times in a row",
	ROW5 = "Row 5 - Won five times in a row",
	CHANNELLEADER = "Channel Leader - Is owner of at least three channels",
	HALFHALF = "50/50 : Perfeect balance between loss and successds",
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
