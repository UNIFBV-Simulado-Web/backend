import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('ai')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('askquestion')
  async generateText(@Body('prompt') prompt: string) {
    if (!prompt) {
      return { error: 'O prompt é obrigatório.' };
    }
    const generatedText = await this.geminiService.generateText(prompt);
    return { response: generatedText };
  }
}
