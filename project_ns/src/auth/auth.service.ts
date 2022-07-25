import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthCredentialsDto } from './dto/auth-credential.dto'
import { User } from './user-entity'
import { UserRepository } from './user-repository'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  //service안에서 repo사용을 위해 삽입
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    //회원가입
    return this.userRepository.createUser(authCredentialsDto)
  }

  async getUserByusername(username: string): Promise<User> {
    //username으로 회원정보 조회
    const found = await this.userRepository.findOne({ where: { username } })
    if (!found) {
      throw new NotFoundException(`can't find User with username ${username}`)
    }
    return found
  }

  async singIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto
    const user = await this.userRepository.findOne({ where: { username } })

    if (user && (await bcrypt.compare(password, user.password))) {
      //유저 토큰 생성 (Secret + Payload)
      const payload: JwtPayload = { username }
      const accessToken = await this.jwtService.sign(payload)

      return { accessToken }
    } else {
      throw new UnauthorizedException('login failed')
    }
  }
}
