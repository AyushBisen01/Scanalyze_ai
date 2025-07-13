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
  findings: z.string().describe('A concise summary (max 20 words) of the most critical finding, including the likely disease and its potential progression.'),
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

You will analyze the provided series of images or video. Your response must adhere to the following strict instructions:

**Instructions for 'findings' output:**
- Your response for 'findings' MUST be a single, concise sentence.
- It MUST be a maximum of 20 words.
- It MUST state the most likely disease and its potential for progression if untreated.
- Example: High-likelihood signs of bacterial pneumonia in the left lung, with potential for progression to pleural effusion.

**Instructions for 'anomalies' output:**
- List any other observed anomalies or areas of interest.

Use the following as the primary source of information. The content could be a series of static images or a video file.

{{#each photoDataUris}}
Content piece {{index}}: {{media url=.}}
{{/each}}

Analyze the entire series/video and provide your response according to the instructions.
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
