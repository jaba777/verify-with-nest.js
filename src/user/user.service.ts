import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUserDto } from './dto/sign-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      !createUserDto.email ||
      !createUserDto.name ||
      !createUserDto.surname ||
      !createUserDto.password
    ) {
      throw { statusCode: 409, message: 'please fill all input' };
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new User({
      ...createUserDto,
      password: hashPassword,
      cars: [],
    });
    return await this.entityManager.save(user);
  }

  async autorisation(signUserDto: SignUserDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: signUserDto.email },
    });

    console.log('findUser', signUserDto);

    if (!findUser) {
      throw { statusCode: 400, message: "this meil isn't registered" };
    }

    const comparePass = await bcrypt.compare(
      signUserDto.password,
      findUser.password,
    );

    if (!comparePass) {
      throw { statusCode: 400, message: "This password isn't correct" };
    }

    const payload = { sub: findUser.id, username: findUser.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const findOne = await this.userRepository.findOne({
      where: { id },
      relations: { cars: true },
    });
    return findOne;
  }
  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async removeCar(id: number) {
    return this.userRepository.delete(id);
  }
}
