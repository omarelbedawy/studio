'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate the best growing conditions for a given plant name.
 *
 * @exports generatePlantConditions - An async function that takes a plant name as input and returns the generated growing conditions.
 * @exports GeneratePlantConditionsInput - The input type for the generatePlantConditions function.
 * @exports GeneratePlantConditionsOutput - The output type for the generatePlantConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlantConditionsInputSchema = z.object({
  plantName: z.string().describe('The name of the plant to generate growing conditions for.'),
});
export type GeneratePlantConditionsInput = z.infer<typeof GeneratePlantConditionsInputSchema>;

const GeneratePlantConditionsOutputSchema = z.object({
  conditions: z.string().describe('The best growing conditions for the plant.'),
});
export type GeneratePlantConditionsOutput = z.infer<typeof GeneratePlantConditionsOutputSchema>;

export async function generatePlantConditions(input: GeneratePlantConditionsInput): Promise<GeneratePlantConditionsOutput> {
  return generatePlantConditionsFlow(input);
}

const generatePlantConditionsPrompt = ai.definePrompt({
  name: 'generatePlantConditionsPrompt',
  input: {schema: GeneratePlantConditionsInputSchema},
  output: {schema: GeneratePlantConditionsOutputSchema},
  prompt: `You are an expert botanist. A user has requested information about the best growing conditions for the plant: {{{plantName}}}.\n\nProvide specific and practical advice regarding sunlight, watering, soil type, temperature, and humidity. Only include conditions that are pertinent and likely to affect plant health.`, 
});

const generatePlantConditionsFlow = ai.defineFlow(
  {
    name: 'generatePlantConditionsFlow',
    inputSchema: GeneratePlantConditionsInputSchema,
    outputSchema: GeneratePlantConditionsOutputSchema,
  },
  async input => {
    const {output} = await generatePlantConditionsPrompt(input);
    return output!;
  }
);
