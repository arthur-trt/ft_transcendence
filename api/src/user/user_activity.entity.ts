import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('UserActivity')
export class UserActivity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@Column({
		default: () => "now()", // you can use () => "now() at time zone 'utc'" here
		type: 'timestamptz' // or use timestamptz
	 })
	online_since: Date;
}
