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
      "A series of medical images (X-ray, CT, MRI) or a video (ultrasound) as data URIs. Each must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMedicalImageInput = z.infer<typeof AnalyzeMedicalImageInputSchema>;

const AnalyzeMedicalImageOutputSchema = z.object({
  findings: z.string().describe('Key findings from the medical image series or video.'),
  anomalies: z.string().describe('Potential anomalies or areas of interest identified in the content.'),
});
export type AnalyzeMedicalImageOutput = z.infer<typeof AnalyzeMedicalImageOutputSchema>;

export async function analyzeMedicalImage(input: AnalyzeMedicalImageInput): Promise<AnalyzeMedicalImageOutput> {
  return analyzeMedicalImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicalImagePrompt',
  input: {schema: AnalyzeMedicalImageInputSchema},
  output: {schema: AnalyzeMedicalImageOutputSchema},
  prompt: `You are an expert radiologist specializing in analyzing series of medical images and videos (like ultrasounds).

You will analyze the provided series of images or video and identify potential anomalies or areas of interest. Your response for 'findings' must be detailed and clinically actionable.

**Instructions for 'findings' output:**
- Provide a high-level summary of the most critical findings.
- State the likelihood of the diagnosis (e.g., "high-likelihood signs of...").
- Specify the affected area as precisely as possible (e.g., "left lower lung lobe").
- If applicable, suggest potential diagnoses for detected anomalies (e.g., "may indicate an early-stage lung neoplasm or granuloma").
- Include a brief, predictive statement about potential progression if untreated (e.g., "potential progression toward pleural effusion within 5–7 days").

Use the following as the primary source of information. The content could be a series of static images or a video file.

{{#each photoDataUris}}
Content piece {{index}}: {{media url=.}}
{{/each}}

Analyze the entire series/video and provide key findings and potential anomalies according to the instructions.
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
