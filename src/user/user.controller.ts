import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  Patch,
  Param,
  Delete,
  Request,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { SignUserDto } from './dto/sign-user.dto';
import { AuthGuard } from './user.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const createUser = await this.userService.create(createUserDto);
      return res.status(HttpStatus.OK).send({
        status: 'success',
        user: createUser,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        error: error.message,
      });
    }
  }

  @Post('sign-in')
  async autorisation(@Body() userSignIn: SignUserDto, @Res() res: Response) {
    try {
      const signIn = await this.userService.autorisation(userSignIn);

      return res.status(HttpStatus.OK).send({
        status: 'success',
        signIn,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        error: error.message,
      });
    }
  }

  @Get('get-all')
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('use-header')
   useHead(@Request() req){
    return req.user
   }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  async removeCars(@Param('id') id: string, @Res() res: Response) {
    try {
      const removeUser = await this.userService.remove(+id);
      return res.status(HttpStatus.OK).send({
        status: 'success',
        delete: removeUser,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        mesage: error.message,
      });
    }
  }
}
