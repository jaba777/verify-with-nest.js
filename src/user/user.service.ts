import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SendEmail, SignUserDto } from './dto/sign-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Verify } from './entities/verify.entity';
import { CreateVerify, ChangePassword } from './dto/verify.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verify)
    private readonly verifyRepository: Repository<Verify>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
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
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(createUserDto.email)) {
      throw { statusCode: 403, message: 'invalid email' };
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

  getProfile() {
    return this.userRepository.find();
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async removeCar(id: number) {
    return this.userRepository.delete(id);
  }

  async sendMail(email: string, generatedOTP: string) {
    this.mailerService.sendMail({
      from: 'tskhovreba888@hotmail.com',
      to: email,
      subject: 'Verify your Email',
      html: `<p>Enter <span style="color: blue; font-size: 30px;">${generatedOTP}</span> in the app to verify your email address and complete the situation</p>`,
    });
  }
  async generateOTP() {
    try {
      const randomNum = `${Math.floor(Math.random() * 999999)}`;
      return randomNum;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(sendEmail: SendEmail) {
    const findUser = await this.userRepository.findOne({
      where: { email: sendEmail.email },
    });
    if (!findUser) {
      throw {
        statusCode: 400,
        message: "This email isn't registered",
      };
    }
    const verifyCode = await this.generateOTP();
    const hashOTP = await bcrypt.hash(verifyCode, 10);

    const verify = new Verify({
      email: sendEmail.email,
      otp: hashOTP,
      isVerified: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 360000),
    });

    await this.sendMail(sendEmail.email, verifyCode);
    return this.entityManager.save(verify);
  }

  async checkVerifyCode(createVerify: CreateVerify) {
    const findVerify = await this.verifyRepository.findOne({
      where: { email: createVerify.email },
    });
    if (!findVerify) {
      throw {
        statusCode: 400,
        message: "This email isn't registered",
      };
    }
    if (findVerify.expiresAt.getTime() < Date.now()) {
      await this.verifyRepository.delete({ email: createVerify.email });
      throw {
        statusCode: 400,
        message: 'time is over, please sent email again',
      };
    }

    const compareOtp = await bcrypt.compare(createVerify.otp, findVerify.otp);
    if (!compareOtp) {
      throw {
        statusCode: 400,
        message: "code isn't correct",
      };
    }

    findVerify.isVerified = true;
    return this.entityManager.save(findVerify);
  }

  async changePassword(changePassword: ChangePassword) {
    const findVerify = await this.verifyRepository.findOne({
      where: { email: changePassword.email, isVerified: true },
    });
    if (!findVerify) {
      throw {
        statusCode: 400,
        message: "This email isn't verified",
      };
    }

    const findUser = await this.userRepository.findOne({
      where: { email: findVerify.email },
    });

    if (!findUser) {
      throw {
        statusCode: 400,
        message: 'Something went wrong, please try again',
      };
    }

    const hashPassword = await bcrypt.hash(changePassword.password, 10);

    findUser.password = hashPassword;
    await this.verifyRepository.delete({ email: changePassword.email });
    return this.entityManager.save(findUser);
  }
}
