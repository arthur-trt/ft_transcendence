import { User } from "src/user/user.entity";
import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm"




export abstract class AMessage  {
	@PrimaryGeneratedColumn()
	id: number;

    @Column('text',{nullable:true})
	sender: User;

    @Column()
    message: string;
}
