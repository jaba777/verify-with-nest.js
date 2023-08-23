import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Car } from 'src/car/entities/car.entity';
@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Car, (car) => car.user, { cascade: true })
  cars: Car[];
}
