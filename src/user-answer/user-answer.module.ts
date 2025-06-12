import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerController } from './user-answer.controller';
import { QuestionModule } from 'src/question/question.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [QuestionModule, PrismaModule],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
})
export class UserAnswerModule {}
