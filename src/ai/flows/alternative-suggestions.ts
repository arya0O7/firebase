// This file holds the Genkit flow for suggesting alternative medicines.
'use server';
/**
 * @fileOverview Suggests over-the-counter medicine alternatives if the searched medicine is out of stock.
 *
 * - getAlternativeSuggestions - A function that suggests alternative medicines.
 * - AlternativeSuggestionsInput - The input type for the getAlternativeSuggestions function.
 * - AlternativeSuggestionsOutput - The return type for the getAlternativeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlternativeSuggestionsInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine that is out of stock.'),
});
export type AlternativeSuggestionsInput = z.infer<typeof AlternativeSuggestionsInputSchema>;

const AlternativeSuggestionsOutputSchema = z.object({
  alternatives: z.array(
    z.string().describe('A list of alternative over-the-counter medicines.')
  ).describe('Suggested over-the-counter alternatives to the specified medicine.'),
});
export type AlternativeSuggestionsOutput = z.infer<typeof AlternativeSuggestionsOutputSchema>;

export async function getAlternativeSuggestions(input: AlternativeSuggestionsInput): Promise<AlternativeSuggestionsOutput> {
  return alternativeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'alternativeSuggestionsPrompt',
  input: {schema: AlternativeSuggestionsInputSchema},
  output: {schema: AlternativeSuggestionsOutputSchema},
  prompt: `The user is looking for alternatives to the medicine "{{{medicineName}}}", which is out of stock.
Suggest 3 common over-the-counter alternatives. Return a JSON array of strings. Do not include any explanation. Simply return the JSON.`,
});

const alternativeSuggestionsFlow = ai.defineFlow(
  {
    name: 'alternativeSuggestionsFlow',
    inputSchema: AlternativeSuggestionsInputSchema,
    outputSchema: AlternativeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
