import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
