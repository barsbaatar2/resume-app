import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { User } from './user.entity';

@Entity('user_experiences')
export class UserExperience extends DefaultEntity {
  @Column({default: null})
  name: string;

  @Column({default: null})
  year: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
