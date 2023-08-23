import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { User } from 'src/user/entities/user.entity';




@Module({
  imports: [TypeOrmModule.forFeature([Car,User])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
