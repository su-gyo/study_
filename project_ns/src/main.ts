import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import * as config from 'config'
//import { setupSwagger } from '@nestjs/swagger'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule)

  //setupSwagger(app)
  const serverConfig = config.get('server')

  const SwaggerConfig = new DocumentBuilder()
    .setTitle('Make Boards')
    .setDescription('board & user')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, SwaggerConfig)
  SwaggerModule.setup('api', app, document)

  const port = serverConfig.port
  await app.listen(port)
  logger.log(`Application running on port ${port}`)
}
bootstrap()
