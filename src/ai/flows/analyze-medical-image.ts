'use server';

/**
 * @fileOverview Medical image analysis AI agent.
 *
 * - analyzeMedicalImage - A function that handles the medical image analysis process.
 * - AnalyzeMedicalImageInput - The input type for the analyzeMedicalImage function.
 * - AnalyzeMedicalImageOutput - The return type for the analyzeMedicalImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMedicalImageInputSchema = z.object({
  photoDataUris: z
    .array(z.string())
    .describe(
      "A series of medical images (X-ray, CT scan, MRI, ultrasound) as data URIs. Each must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMedicalImageInput = z.infer<typeof AnalyzeMedicalImageInputSchema>;

const AnalyzeMedicalImageOutputSchema = z.object({
  findings: z.string().describe('Key findings from the medical image series.'),
  anomalies: z.string().describe('Potential anomalies or areas of interest identified in the images.'),
});
export type AnalyzeMedicalImageOutput = z.infer<typeof AnalyzeMedicalImageOutputSchema>;

export async function analyzeMedicalImage(input: AnalyzeMedicalImageInput): Promise<AnalyzeMedicalImageOutput> {
  return analyzeMedicalImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicalImagePrompt',
  input: {schema: AnalyzeMedicalImageInputSchema},
  output: {schema: AnalyzeMedicalImageOutputSchema},
  prompt: `You are an expert radiologist specializing in analyzing series of medical images.

You will analyze the provided series of medical images and identify potential anomalies or areas of interest. Synthesize your findings from all images into a cohesive summary.

Use the following as the primary source of information about the medical image series.

{{#each photoDataUris}}
Image {{index}}: {{media url=this}}
{{/each}}

Analyze the entire image series and provide key findings and potential anomalies.
`,
});

const analyzeMedicalImageFlow = ai.defineFlow(
  {
    name: 'analyzeMedicalImageFlow',
    inputSchema: AnalyzeMedicalImageInputSchema,
    outputSchema: AnalyzeMedicalImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
