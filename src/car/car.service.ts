import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}
  create(createCarDto: CreateCarDto) {
    return 'This action adds a new car';
  }

  findAll() {
    return `This action returns all car`;
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  async update(id: number, createCarDto: CreateCarDto) {
    const findUser = await this.userRepository.findOne({
      where: {id},
      relations: {cars: true}
    })
    if (!findUser) {
      return null; 
    }

   const cars = new Car({
     ...createCarDto,
   });

   findUser.cars.push(cars)
    
    return await this.entityManager.save(findUser);
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
