import { AbstractEntity } from 'src/database/abstract.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Verify extends AbstractEntity<Verify> {
  @Column()
  email: string;
  @Column()
  otp: string;

  @Column()
  isVerified: boolean;

  @Column()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
