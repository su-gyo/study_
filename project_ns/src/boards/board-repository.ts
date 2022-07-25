import { Repository } from 'typeorm'
import { Board } from './board-entity'
import { BoardStatus } from './board-status.enum'
import { CreateBoardDto } from './dto/create-board.dto'
import { CustomRepository } from './typeorm-ex.decorator'
import { User } from 'src/auth/user-entity'

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto

    const board = new Board()
    board.title = title
    board.description = description
    board.status = BoardStatus.PUBLIC
    board.user = user
    await board.save()

    delete board.user

    return board
  }
}
