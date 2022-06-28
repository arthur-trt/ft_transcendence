
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity('Users') /** table name */
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
	})
	name: string;

	@Column({
		type: 'varchar',
	})
	mail: string;

	@ManyToMany(() => Channel, channel => channel.users)
	@JoinTable()
	channels : Channel[]

}
