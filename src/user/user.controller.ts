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
import { SignUserDto, SendEmail } from './dto/sign-user.dto';
import { AuthGuard } from './user.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateVerify, ChangePassword } from './dto/verify.dto';

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

  @Post('forget-pass')
  async forgetPassword(@Body() sendEmail: SendEmail, @Res() res: Response) {
    try {
      const forgetPass = await this.userService.forgetPassword(sendEmail);
      return res.status(HttpStatus.OK).send({
        status: 'success',
        verify: forgetPass,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        error: error.message,
      });
    }
  }

  @Patch('check-otp')
  async checkVerifyCode(
    @Body() createVerify: CreateVerify,
    @Res() res: Response,
  ) {
    try {
      const checkingVerify =
        await this.userService.checkVerifyCode(createVerify);
      return res.status(HttpStatus.OK).send({
        status: 'success',
        verify: checkingVerify,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        status: 'failed',
        error: error.message,
      });
    }
  }

  @Patch('change-password')
  async changePassword(
    @Body() changePassword: ChangePassword,
    @Res() res: Response,
  ) {
    try {
      const changePass = await this.userService.changePassword(changePassword);
       return res.status(HttpStatus.OK).send({
         status: 'success',
         changePass,
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
  useHead(@Request() req) {
    return req.user;
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
