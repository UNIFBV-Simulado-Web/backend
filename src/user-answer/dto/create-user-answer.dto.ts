import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
export class CreateUserAnswerDto {
  userId: number;

  @Type(() => Number)
  @IsNotEmpty({
    message: 'O ID da pergunta (questionId) não pode estar vazio.',
  })
  @IsInt({
    message: 'O ID da pergunta (questionId) deve ser um número inteiro.',
  })
  @IsPositive({
    message: 'O ID da pergunta (questionId) deve ser um número positivo.',
  })
  questionId: number;

  @Type(() => Number)
  @IsNotEmpty({
    message:
      'O ID da alternativa selecionada (selectedAlternativeId) não pode estar vazio.',
  })
  @IsInt({
    message:
      'O ID da alternativa selecionada (selectedAlternativeId) deve ser um número inteiro.',
  })
  @IsPositive({
    message:
      'O ID da alternativa selecionada (selectedAlternativeId) deve ser um número positivo.',
  })
  selectedAlternativeId: number;
}
