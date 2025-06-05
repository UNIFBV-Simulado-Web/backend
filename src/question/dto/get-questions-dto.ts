import { GetQuestionsParamsDto } from '../question.service';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class GetQuestionsQueryDto implements GetQuestionsParamsDto {
  @IsOptional()
  @IsString({ message: 'O idioma deve ser uma string.' })
  language?: string;

  @IsOptional()
  @IsString({ message: 'A disciplina deve ser uma string.' })
  discipline?: string;

  @Type(() => Number)
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade deve ser no mínimo 1.' })
  @IsNotEmpty({ message: 'O parâmetro quantity é obrigatório.' })
  quantity: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O ano deve ser um número inteiro.' })
  year?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'O parâmetro random deve ser um booleano.' })
  random?: boolean;
}
