import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
  Logger,
} from '@nestjs/common';
import {
  GetQuestionsParamsDto,
  QuestionService,
  QuestionWithRelations,
} from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionsQueryDto } from './dto/get-questions-dto';

@Controller('question')
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);

  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async findFiltered(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    queryParams: GetQuestionsQueryDto,
  ): Promise<QuestionWithRelations[]> {
    this.logger.log(
      `Recebida requisição GET /questions com query params: ${JSON.stringify(queryParams)}`,
    );

    const params: GetQuestionsParamsDto = {
      language: queryParams.language,
      discipline: queryParams.discipline,
      quantity: queryParams.quantity,
      year: queryParams.year,
      random: queryParams.random ?? false,
    };

    return this.questionService.findFilteredQuestions(params);
  }
}
