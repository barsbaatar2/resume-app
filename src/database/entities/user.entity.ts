import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { UserSkill } from './user-skill.entity';
import { UserExperience } from './user-experience.entity';

@Entity('users')
export class User extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ select: false, nullable: true })
  refreshToken: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  follows: number;

  @Column({ nullable: true })
  workMode: string;

  @Column({ nullable: true })
  workType: string;

  @Column({ nullable: true })
  workCommitment: string;

  @Column({ default: 0 })
  rateValue: number;

  @Column({ nullable: true })
  rateType: string;

  @Column({ nullable: true })
  primaryJob: string;

  @Column({ nullable: true })
  secondaryJob: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  aboutMe: string;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(() => UserSkill, (skills) => skills.user)
  skills: UserSkill[];

  @OneToMany(() => UserExperience, (experiences) => experiences.user)
  experiences: UserExperience[];

}
