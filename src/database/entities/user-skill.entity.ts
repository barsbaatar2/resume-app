import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { User } from './user.entity';

@Entity('user_skills')
export class UserSkill extends DefaultEntity {
  @Column({default: null})
  name: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
