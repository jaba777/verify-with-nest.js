import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Put,
  Res,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/user/user.guard';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createCarDto: CreateCarDto,
    @Res() res: Response,
  ) {
    try {
      const createCars = await this.carService.update(+id, createCarDto);
      return res.status(HttpStatus.OK).send({
        status: 'success',
        cars: createCars,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateCar(
    @Param('id') id: string,
    @Body() createCarDto: CreateCarDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const user= req.user;
      const updateCar = await this.carService.updateCar(
        +id,
        user.sub,
        createCarDto,
      );
      return res.status(HttpStatus.OK).send({
        status: 'success',
        updateCar,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
