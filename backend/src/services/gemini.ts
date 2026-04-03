import { GoogleGenerativeAI } from "@google/generative-ai";
import type { WorkoutCheckInRequest } from "../types/workout.js";

/**
 * Modelo estável atual
 * @see https://ai.google.dev/gemini-api/docs/models
 */
const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key?.trim()) {
    throw new Error(
      "GEMINI_API_KEY não configurada. Defina a variável de ambiente antes de chamar o serviço.",
    );
  }
  return key.trim();
}

/**
 * Construir instruções do sistema para o modelo de IA.
 * Define o papel e as regras de adaptação de treinos.
 */
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

/**
 * Construir conteúdo do usuário com os dados recebidos.
 * Formata os dados de entrada para o prompt da IA.
 */
function buildUserContent(data: WorkoutCheckInRequest): string {
  return `Dados do check-in:

## Rotina base
${data.baseWorkoutRoutine}

## Tempo disponível
${data.availableTimeMinutes} minutos

## Nível de fadiga (1 = muito descansado, 5 = muito fatigado)
${data.fatigueLevel}

## Histórico e observações
${data.historyNotes || "(nenhuma observação adicional)"}

Com base nas regras do sistema, gere o treino adaptado para hoje, em texto contínuo e objetivo.`;
}

/**
 * Gera um stream de treino adaptado usando a API Gemini.
 *
 * @param data - Dados validados do check-in (rotina base, tempo, fadiga, histórico)
 * @returns AsyncIterable do stream de resposta da IA, com chunks de texto
 */
export async function generateWorkoutStream(data: WorkoutCheckInRequest) {
  // Validar configuração da API
  const apiKey = getApiKey();

  // Inicializar cliente Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: getModelId(),
    systemInstruction: buildSystemInstruction(),
  });

  // Construir prompt com contexto e dados
  const userContent = buildUserContent(data);

  // Chamar generateContentStream para retornar stream em tempo real
  const result = await model.generateContentStream(userContent);

  return result.stream;
}
