import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm"




export abstract class AMessage  {
	@PrimaryGeneratedColumn()
	id: number;

    @Column()
	message: string;

	@CreateDateColumn({ nullable : true, type: "timestamp"})
	sent_at: Date;
}
