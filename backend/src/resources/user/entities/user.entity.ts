import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users', orderBy: { createdAt: 'ASC' } })
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  @Index()
  firstName: string;

  @Column({ nullable: false })
  @Index()
  lastName: string;

  @Column({ nullable: false })
  @Index()
  email: string;

  @Column({ default: null })
  contactNumber: string;

  @Column({ default: null })
  country: string;

  @Column({ default: false })
  hasEmailVerified: boolean;

  @Column({ default: null, type: 'text' })
  emailVerificationToken: string;

  @Column({ nullable: false })
  @Index()
  skills: string[];


  @Column({ nullable: false })
  password: string;

  @Column()
  avatar: string;

  @Column()
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  public deletedAt: Date;

  @Column({ default: false })
  public isDeleted: boolean;
}