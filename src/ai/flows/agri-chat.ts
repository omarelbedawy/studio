
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

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

export const AgriChatInputSchema = z.object({
  language: z.string().describe('The language for the conversation.'),
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type AgriChatInput = z.infer<typeof AgriChatInputSchema>;

export const AgriChatOutputSchema = z.object({
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
