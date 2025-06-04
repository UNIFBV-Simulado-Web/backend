import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  email: string;

  @IsString({ message: 'O nome completo deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome completo não pode estar vazio.' })
  @MinLength(3, { message: 'O nome completo deve ter no mínimo 3 caracteres.' })
  nomeCompleto: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
}
