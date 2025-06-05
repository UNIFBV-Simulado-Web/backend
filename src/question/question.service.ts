import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, Alternative, File as PrismaFile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface GetQuestionsParamsDto {
  language?: string;
  discipline?: string;
  quantity: number;
  year?: number;
  random?: boolean;
}

export interface QuestionWithRelations extends Question {
  alternatives: Alternative[];
  files: PrismaFile[];
}
@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(private readonly prisma: PrismaService) {}
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async findFilteredQuestions({
    language,
    discipline,
    quantity,
    year,
    random = false,
  }: GetQuestionsParamsDto): Promise<QuestionWithRelations[]> {
    if (quantity <= 0) {
      this.logger.warn(
        'A quantidade deve ser um número positivo. Retornando um array vazio.',
      );
      return [];
    }

    const whereClause: any = {};

    if (language) {
      whereClause.language = language;
    }

    if (discipline) {
      whereClause.discipline = discipline;
    }

    if (year) {
      whereClause.year = year;
    }

    this.logger.log(
      `Buscando questões com filtros: ${JSON.stringify(whereClause)}, quantidade: ${quantity}, aleatório: ${random}`,
    );

    try {
      if (random) {
        const questionIdsObjects = await this.prisma.question.findMany({
          where: whereClause,
          select: {
            id: true,
          },
        });

        if (!questionIdsObjects || questionIdsObjects.length === 0) {
          this.logger.log(
            'Nenhuma questão encontrada com os filtros fornecidos para busca aleatória.',
          );
          return [];
        }

        let allIds = questionIdsObjects.map((q) => q.id);

        allIds = this.shuffleArray(allIds);

        const randomIdsToFetch = allIds.slice(0, quantity);

        if (randomIdsToFetch.length === 0) {
          return [];
        }

        const questions = await this.prisma.question.findMany({
          where: {
            id: {
              in: randomIdsToFetch,
            },
          },
          include: {
            alternatives: true,
            files: true,
          },
        });

        const questionsMap = new Map(questions.map((q) => [q.id, q]));
        const orderedRandomQuestions = randomIdsToFetch
          .map((id) => questionsMap.get(id))
          .filter((q) => q !== undefined) as QuestionWithRelations[];

        return orderedRandomQuestions;
      } else {
        const questions = await this.prisma.question.findMany({
          where: whereClause,
          take: quantity,
          include: {
            alternatives: true,
            files: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        if (!questions || questions.length === 0) {
          this.logger.log(
            'Nenhuma questão encontrada com os filtros fornecidos.',
          );
          return [];
        }
        return questions as QuestionWithRelations[];
      }
    } catch (error) {
      this.logger.error(
        'Erro ao buscar questões no banco de dados:',
        error.stack || error,
      );
      throw new Error('Não foi possível buscar as questões do banco de dados.');
    }
  }
}
