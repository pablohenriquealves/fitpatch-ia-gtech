import { GoogleGenerativeAI } from "@google/generative-ai";
import type { WorkoutCheckInRequest } from "../types/workout.js";

/** Modelo estável atual (1.5 foi removido da API; ver https://ai.google.dev/gemini-api/docs/models ) */
const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key?.trim()) {
    throw new Error(
      "GEMINI_API_KEY não configurada. Defina a variável de ambiente antes de chamar o serviço."
    );
  }
  return key.trim();
}

function buildSystemInstruction(): string {
  return `Você é o FitPatch IA, um Especialista em Fisiologia do Exercício e Personal Trainer Analítico. Seu objetivo é adaptar fichas de musculação em tempo real para alunos que lidam com rotinas imprevisíveis, garantindo foco em hipertrofia e segurança.

Regras de adaptação:
1. Tempo disponível (availableTimeMinutes): Ajuste estritamente o treino. Menos de 40 min exige bi-sets e foco em exercícios compostos essenciais. De 90 a 120 min permite um treino de hipertrofia completo (focado na faixa de 8 a 10 repetições) com descansos mais longos (90s a 120s).
2. Nível de fadiga (fatigueLevel de 1 a 5, onde 1 = descansado e 5 = muito fatigado): Se a fadiga for 4 ou 5, reduza cargas em 10% a 20% e priorize máquinas no lugar de pesos livres pesados para evitar lesões. Se for 1 ou 2, sugira progressão de carga estruturada.
3. Histórico (historyNotes): Use as cargas anteriores para balizar o treino atual e incorpore o contexto sem inventar informações médicas.
4. OBRIGATÓRIO - FORMATO DE SAÍDA:
Sua resposta será consumida por uma interface em React e renderizada em Cards. Você DEVE usar o delimitador "---" para separar a introdução e cada um dos exercícios. Não inclua textos de saudação ou despedida. Responda ESTRITAMENTE no formato Markdown abaixo:

**Foco do Dia:** [Resumo de 1 linha da adaptação feita]
---
**Exercício:** [Nome do Exercício]
**Séries e Repetições:** [ex: 3x 8-10]
**Descanso:** [ex: 60s]
**Carga Sugerida:** [Cálculo baseado no histórico e na fadiga atual]
**Nota do Treinador:** [Apenas se houver uma adaptação específica, ex: "Substituído por máquina devido à fadiga alta"]
---
**Exercício:** [Próximo Exercício]`;
}

function buildUserContent(req: WorkoutCheckInRequest): string {
  return `Dados do check-in:

## Rotina base
${req.baseWorkoutRoutine}

## Tempo disponível
${req.availableTimeMinutes} minutos

## Nível de fadiga (1 = muito descansado, 5 = muito fatigado)
${req.fatigueLevel}

## Histórico e observações
${req.historyNotes || "(nenhuma observação adicional)"}

Com base nas regras do sistema, gere o treino adaptado para hoje, em texto contínuo e objetivo.`;
}

export interface GeminiStreamChunk {
  text: string;
}

/**
 * Retorna um AsyncIterable de chunks de texto do modelo (streaming).
 */
export async function streamAdaptedWorkout(
  request: WorkoutCheckInRequest
): Promise<AsyncIterable<GeminiStreamChunk>> {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: getModelId(),
    systemInstruction: buildSystemInstruction(),
  });

  const userContent = buildUserContent(request);
  const result = await model.generateContentStream(userContent);

  async function* iterate(): AsyncGenerator<GeminiStreamChunk> {
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield { text };
      }
    }
  }

  return iterate();
}
