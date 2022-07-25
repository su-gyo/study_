import { Injectable, NotFoundException } from '@nestjs/common'
//import { BoardStatus } from './board-status.enum'
//import { v1 as uuid } from 'uuid'
import { CreateBoardDto } from './dto/create-board.dto'
import { BoardRepository } from './board-repository'
import { Board } from './board-entity'
import { BoardStatus } from './board-status.enum'
import { User } from 'src/auth/user-entity'
//import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async getAllBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board')

    query.where('board.userId = :userId', { userId: user.id })

    const boards = await query.getMany()
    return boards
  }

  async getBoardById(id: number, user: User): Promise<Board> {
    //ID로 찾아오기
    const found = await this.boardRepository.findOne({
      where: { id, userId: user.id },
    })

    if (!found) {
      throw new NotFoundException(`can't find Board with id ${id}`)
    }
    return found
  }

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    //게시물 생성
    return this.boardRepository.createBoard(createBoardDto, user)
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    //게시물 삭제
    const result = await this.boardRepository.delete({ id, userId: user.id })

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`)
    }
  }

  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    //게시물 업데이트
    const board = await this.getBoardById(id, user)
    board.status = status
    await board.save()
    return board
  }
}
