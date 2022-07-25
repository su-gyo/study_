import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UserRepository } from './user-repository'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { User } from './user-entity'
import * as config from 'config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload) {
    const { username } = payload
    const user: User = await this.userRepository.findOne({
      where: { username },
    })

    if (!user) {
      throw new UnauthorizedException(console.log('nope'))
    }
    return user
  }
}
