import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserAnswerModule } from './user-answer/user-answer.module';
import { AuthModule } from './user/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    QuestionModule,
    PrismaModule,
    UserAnswerModule,
    AuthModule,
    ConfigModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
