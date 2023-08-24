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

  async findOne(id: number) {
    const car = await this.carRepository.findOne({
      select: ['id', 'color', 'age'],
      where: { id },
      relations: ['user'], // Include the 'user' relation
    });
    if (!car) {
      throw { statusCode: 402, message: 'Car not found' };
    }
    return car;
  }

  async update(id: number, createCarDto: CreateCarDto) {
    const findUser = await this.userRepository.findOne({
      where: { id },
      relations: { cars: true },
    });
    if (!findUser) {
      return null;
    }

    const cars = new Car(createCarDto);

    findUser.cars.push(cars);

    return await this.entityManager.save(findUser);
  }

  async updateCar(id: number, userId: number, createCarDto: CreateCarDto) {
    const car = await this.carRepository.findOne({
      select: ['id', 'color', 'age'],
      where: { id: id },
      relations: ['user'], // Include the 'user' relation
    });
    if (!car) {
      throw { statusCode: 402, message: 'Car not found' };
    }

    if (car.user.id !== userId) {
      throw { statusCode: 402, message: 'this isn not your car' };
    }

    const updatedCar = await this.carRepository.findOne({
      where: { id: id },
    });
    if (!updatedCar) {
      throw { statusCode: 402, message: 'Car not foundssss' };
    }

    updatedCar.model = createCarDto.model;
    updatedCar.color = createCarDto.color;
    updatedCar.age = createCarDto.age;
    updatedCar.describe = createCarDto.describe;

    return this.carRepository.save(updatedCar);
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
