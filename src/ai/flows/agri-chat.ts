
'use server';
/**
 * @fileOverview A conversational AI agent for agricultural topics.
 * 
 * - chat - A function that handles the conversation.
 * - AgriChatInput - The input type for the chat function.
 * - AgriChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DiagnosePlantOutputSchema = z.object({
  isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
  disease: z.string().describe("The common name of the disease if the plant is not healthy, otherwise 'None'."),
  remedy: z.string().describe('A suggested remedy if the plant is not healthy.')
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const AgriChatInputSchema = z.object({
  language: z.string().describe('The language for the conversation.'),
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
  diagnosis: DiagnosePlantOutputSchema.nullable().describe('The current plant diagnosis, if available.'),
});
export type AgriChatInput = z.infer<typeof AgriChatInputSchema>;

const AgriChatOutputSchema = z.object({
  response: z.string().describe('The AI model\'s response.'),
});
export type AgriChatOutput = z.infer<typeof AgriChatOutputSchema>;


export async function chat(input: AgriChatInput): Promise<AgriChatOutput> {
  return agriChatFlow(input);
}

const agriChatPrompt = ai.definePrompt({
  name: 'agriChatPrompt',
  input: {schema: AgriChatInputSchema},
  output: {schema: AgriChatOutputSchema},
  prompt: `You are an expert agricultural assistant. Your goal is to provide helpful, accurate, and concise information about farming, plants, soil, pests, and all other agriculture-related topics.

The user has selected their preferred language for this conversation: {{{language}}}.
All your responses must be in this language.

{{#if diagnosis}}
The user's plant has recently been diagnosed. Here is the diagnosis information:
- Is Healthy: {{diagnosis.isHealthy}}
- Disease: {{diagnosis.disease}}
- Remedy: {{diagnosis.remedy}}

If the user asks about the plant's health, its disease, or how to treat it, use this information to answer their questions.
{{/if}}

Here is the conversation history so far:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

Here is the user's latest message:
{{{message}}}

Your task is to provide a helpful response to the user's message in the selected language ({{{language}}}).`,
});

const agriChatFlow = ai.defineFlow(
  {
    name: 'agriChatFlow',
    inputSchema: AgriChatInputSchema,
    outputSchema: AgriChatOutputSchema,
  },
  async (input) => {
    const { output } = await agriChatPrompt(input);
    return output!;
  }
);
