import { Entity, Column, Check, ManyToOne } from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';
import { User } from 'src/user/entities/user.entity';

enum CarModel {
  BMW = 'BMW',
  MERCEDES = 'MERCEDES',
  AUDI = 'AUDI',
}

enum CarColor {
  WHITE = 'white',
  BLACK = 'black',
  RED = 'red',
}

@Entity()
@Check(`"age" > 2008`)
export class Car extends AbstractEntity<Car> {
  @Column({
    type: 'enum',
    enum: CarModel,
    default: CarModel.BMW,
  })
  model: CarModel;

  @Column({
    type: 'enum',
    enum: CarColor,
    default: CarColor.BLACK,
  })
  color: CarColor;
  @Column({ type: 'integer' })
  age: number;

  @Column()
  describe: string;
  @ManyToOne(() => User, (user) => user.cars, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
