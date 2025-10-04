'use server';
/**
 * @fileOverview Provides medicine information based on a user's search query.
 *
 * - getMedicineInformation - A function that retrieves a summary of what a medicine is used for.
 * - GetMedicineInformationInput - The input type for the getMedicineInformation function.
 * - GetMedicineInformationOutput - The return type for the getMedicineInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMedicineInformationInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to get information about.'),
});
export type GetMedicineInformationInput = z.infer<typeof GetMedicineInformationInputSchema>;

const GetMedicineInformationOutputSchema = z.object({
  summary: z.string().describe('A simple, easy-to-understand summary of what the medicine is used for.'),
});
export type GetMedicineInformationOutput = z.infer<typeof GetMedicineInformationOutputSchema>;

export async function getMedicineInformation(input: GetMedicineInformationInput): Promise<GetMedicineInformationOutput> {
  return getMedicineInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMedicineInformationPrompt',
  input: {schema: GetMedicineInformationInputSchema},
  output: {schema: GetMedicineInformationOutputSchema},
  prompt: `You are a helpful AI assistant that provides information about medicines.
  Provide a simple, easy-to-understand summary of what the medicine is used for.

  Medicine Name: {{{medicineName}}}
  `,
});

const getMedicineInformationFlow = ai.defineFlow(
  {
    name: 'getMedicineInformationFlow',
    inputSchema: GetMedicineInformationInputSchema,
    outputSchema: GetMedicineInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
