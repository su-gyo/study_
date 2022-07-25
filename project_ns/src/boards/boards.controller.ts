import {
  Body,
  Controller,
  //Delete,
  Get,
  Post,
  UsePipes,
  Param,
  Delete,
  Patch,
  UseGuards,
  ParseIntPipe,
  Logger,
  //Patch,
} from '@nestjs/common'
import { BoardsService } from './boards.service'
//import { BoardStatus } from './board-status.enum'
import { CreateBoardDto } from './dto/create-board.dto'
import { ValidationPipe } from '@nestjs/common'
//import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe'
import { Board } from './board-entity'
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe'
import { BoardStatus } from './board-status.enum'
import { ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/auth/user-entity'

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController')
  constructor(private boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: '모든 게시물 가져오기' })
  getAllBoard(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User "${user.username} trying to get all boards`)
    return this.boardsService.getAllBoards(user)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'ID로 게시물 찾기' })
  getBoardById(@Param('id') id: number, @GetUser() user: User): Promise<Board> {
    return this.boardsService.getBoardById(id, user)
  }

  @Post()
  @ApiOperation({ summary: '게시물 생성' })
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(`User "${user.username}" creating a new board.
    Payload: ${JSON.stringify(createBoardDto)}`)
    return this.boardsService.createBoard(createBoardDto, user)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'ID로 게시물 삭제' })
  deleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoard(id, user)
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: '게시물 상태 업데이트' })
  updatdBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status, user)
  }
}
