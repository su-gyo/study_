import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credential.dto'
import { GetUser } from './get-user.decorator'
import { User } from './user-entity'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  }

  @Get('/:username')
  @ApiOperation({ summary: 'username으로 회원정보 조회' })
  getBoardById(@Param('username') username: string): Promise<User> {
    return this.authService.getUserByusername(username)
  }

  @Post('/signIn')
  @ApiOperation({ summary: '로그인' })
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredentialsDto)
  }

  @Post('authTest')
  @UseGuards(AuthGuard())
  authTest(@GetUser() user: User) {
    console.log('user', user)
  }
}
