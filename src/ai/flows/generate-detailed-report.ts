// This file is machine-generated - edit with caution!
'use server';

/**
 * @fileOverview Generates a detailed, doctor-level report based on image analysis.
 *
 * - generateDetailedReport - A function that generates the detailed report.
 * - GenerateDetailedReportInput - The input type for the generateDetailedReport function.
 * - GenerateDetailedReportOutput - The return type for the generateDetailedReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDetailedReportInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An X-ray, CT scan, MRI, or ultrasound image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  findings: z.string().describe('The findings from the image analysis.'),
  patientHistory: z.string().describe('The patient\'s medical history.'),
});
export type GenerateDetailedReportInput = z.infer<typeof GenerateDetailedReportInputSchema>;

const GenerateDetailedReportOutputSchema = z.object({
  report: z.string().describe('The detailed doctor-level report.'),
  criticality: z.enum(['normal', 'critical']).describe('The criticality of the findings.'),
  suggestedTreatment: z.string().describe('Suggested treatment methods or further tests.'),
});
export type GenerateDetailedReportOutput = z.infer<typeof GenerateDetailedReportOutputSchema>;

export async function generateDetailedReport(
  input: GenerateDetailedReportInput
): Promise<GenerateDetailedReportOutput> {
  return generateDetailedReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedReportPrompt',
  input: {schema: GenerateDetailedReportInputSchema},
  output: {schema: GenerateDetailedReportOutputSchema},
  prompt: `You are an expert radiologist preparing a detailed report for other doctors.

Based on the image analysis findings and patient history, generate a comprehensive doctor-level report. Explain potential diagnoses with reasoning, suggest treatment methods or further tests, and indicate the criticality of the findings (normal or critical).

Image:
{{media url=imageDataUri}}

Findings: {{{findings}}}
Patient History: {{{patientHistory}}}

Report Format:
Report: [Detailed report here]
Criticality: [normal or critical]
Suggested Treatment: [Treatment suggestions or further tests]`,
});

const generateDetailedReportFlow = ai.defineFlow(
  {
    name: 'generateDetailedReportFlow',
    inputSchema: GenerateDetailedReportInputSchema,
    outputSchema: GenerateDetailedReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
