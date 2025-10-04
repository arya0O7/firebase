// Scans a prescription image for medicines.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanPrescriptionInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ScanPrescriptionInput = z.infer<typeof ScanPrescriptionInputSchema>;

const ScanPrescriptionOutputSchema = z.object({
  medicines: z.array(z.string()).describe('A list of medicines found on the prescription.'),
});
export type ScanPrescriptionOutput = z.infer<typeof ScanPrescriptionOutputSchema>;

export async function scanPrescription(input: ScanPrescriptionInput): Promise<ScanPrescriptionOutput> {
  return scanPrescriptionFlow(input);
}

const scanPrescriptionPrompt = ai.definePrompt({
  name: 'scanPrescriptionPrompt',
  input: {schema: ScanPrescriptionInputSchema},
  output: {schema: ScanPrescriptionOutputSchema},
  prompt: `You are a helpful pharmacy assistant. You will receive an image of a prescription. Your task is to identify and list all the medicines on it.

Prescription Image: {{media url=prescriptionImage}}

Return a JSON object containing a single key "medicines" which is an array of the medicine names you found.
`,
});

const scanPrescriptionFlow = ai.defineFlow(
  {
    name: 'scanPrescriptionFlow',
    inputSchema: ScanPrescriptionInputSchema,
    outputSchema: ScanPrescriptionOutputSchema,
  },
  async input => {
    const {output} = await scanPrescriptionPrompt(input);
    return output!;
  }
);
