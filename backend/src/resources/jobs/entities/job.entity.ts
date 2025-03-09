import { Application } from 'src/resources/apply/entities/application.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'jobs', orderBy: { createdAt: 'ASC' } })
export class Job {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  @Index()
  title: string;

  @Column({ nullable: false })
  @Index()
  description: string;

  @Column({ nullable: false })
  skills: string[];

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
    
  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
