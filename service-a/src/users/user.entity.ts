import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'THB' })
  currency: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance: number;
 
}
