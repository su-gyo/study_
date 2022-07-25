import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { CustomRepository } from 'src/boards/typeorm-ex.decorator'
import { Repository } from 'typeorm/repository/Repository'
import { AuthCredentialsDto } from './dto/auth-credential.dto'
import { User } from './user-entity'
import * as bcrypt from 'bcryptjs'

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = this.create({ username, password: hashedPassword })

    try {
      await user.save()
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing username')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}
