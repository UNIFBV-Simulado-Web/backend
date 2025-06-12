import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class UserAnswerService {
  constructor(
    private prisma: PrismaService,
    private questionService: QuestionService,
  ) {}

  findAllByUser(userId: number) {
    return this.prisma.userAnswer.findMany({
      where: { userId: userId },
      include: { question: { include: { alternatives: true, files: true } } },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.userAnswer.findUnique({
      where: { id, userId },
      include: { question: { include: { alternatives: true, files: true } } },
    });
  }

  update(id: number, updateUserAnswerDto: UpdateUserAnswerDto) {
    return `This action updates a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
  async create(
    createUserAnswerDto: CreateUserAnswerDto[],
    userId: number,
  ): Promise<void> {
    const questionsIds = createUserAnswerDto.map((dto) => dto.questionId);
    const questions = await this.questionService.findMany(questionsIds);
    if (!questions || questions.length < createUserAnswerDto.length) {
      throw new BadRequestException('Questões não encontradas.');
    }
    const createUserAnswerDtoWithCorrect = createUserAnswerDto.map((dto) => {
      const question = questions.find((q) => q.id === dto.questionId);
      const isCorrect = !!question?.alternatives.find(
        (alternative) => alternative.id === dto.selectedAlternativeId,
      )?.is_correct;
      return { ...dto, isCorrect, userId: userId };
    });
    await this.prisma.userAnswer.createMany({
      data: createUserAnswerDtoWithCorrect,
    });
  }
}
