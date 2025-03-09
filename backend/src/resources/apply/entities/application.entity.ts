import { Job } from 'src/resources/jobs/entities/job.entity';
import { User } from 'src/resources/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, ObjectId, ObjectIdColumn, JoinColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'applications', orderBy: { createdAt: 'ASC' } })
export class Application {
  @ObjectIdColumn()
  _id: ObjectId;

  @ManyToOne(() => User, user => user._id, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Job, job => job._id, { nullable: false })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  appliedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
