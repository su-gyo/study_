import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmExModule } from 'src/boards/typeorm-ex.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { UserRepository } from './user-repository'
import * as config from 'config'

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      //토큰을 만들 때 이용하는 secret 텍스트
      signOptions: {
        expiresIn: process.env.JWR_SECRET || jwtConfig.expiresIn,
        // eslint-disable-next-line prettier/prettier
      }
      // eslint-disable-next-line prettier/prettier
            //정해진 시간 이후에는 토큰이 유효하지 않게 됨. 60 * 60 은 한시간 이후에는 토큰이 유효x
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
