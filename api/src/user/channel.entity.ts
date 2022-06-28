


import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('Channels') /** table name */
export class Channel extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
	})
	name: string;

	// @Column({
	// 	type: 'varchar',
	// })

	@ManyToMany(() => User, user => user.channels)
	@JoinTable()		/* owner is channels */
	users: User[]

}
