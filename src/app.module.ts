import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [QuestionModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
