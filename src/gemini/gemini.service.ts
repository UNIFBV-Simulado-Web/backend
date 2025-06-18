// src/gemini/gemini.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly prePrompt = `
  Você é um tutor especialista em pré-vestibular chamado AprendeAi+. Sua tarefa é explicar a seguinte questão do ENEM de forma clara e objetiva.

Siga exatamente esta estrutura na sua resposta e não utilize * na resposta:
1.  Alternativa Correta: Indique a letra correta.
2.  Explicação da Resposta: Forneça um raciocínio detalhado e passo a passo sobre por que a alternativa correta é a certa.
3.  Análise das Incorretas: Justifique brevemente por que cada uma das outras alternativas está errada, apontando o erro conceitual em cada uma.

A questão é:`;

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY') as string,
    );

    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(this.prePrompt + prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erro ao gerar texto:', error);
      throw new Error('Falha ao se comunicar com a API da AI.');
    }
  }
}
