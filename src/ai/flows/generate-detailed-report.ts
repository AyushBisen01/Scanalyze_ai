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
  prompt: `You are an expert radiologist AI, tasked with creating a comprehensive, doctor-level report. The report must be detailed, well-structured, and clear for other medical professionals.

Analyze the provided information:
- Image: {{media url=imageDataUri}}
- Key Findings from Initial Analysis: {{{findings}}}
- Patient History: {{{patientHistory}}}

Based on this, generate a report with the following structure:

1.  **Detailed Analysis:** Elaborate on the initial findings. Describe the location, size, shape, and characteristics of any identified structures or anomalies in detail. Correlate these findings with the patient's history.
2.  **Differential Diagnosis:** List the most likely diagnoses, followed by other possibilities. For each, provide a brief rationale explaining how the findings and history support or contradict it.
3.  **Conclusion:** Summarize the most critical findings and state the most probable diagnosis.
4.  **Recommendations:** Suggest specific next steps, such as further imaging studies (e.g., contrast-enhanced CT, MRI with specific sequences), laboratory tests, specialist consultations, or potential treatment options.
5.  **Criticality Assessment:** Based on your analysis, determine if the case is 'normal' or 'critical'.

Populate the 'report', 'suggestedTreatment', and 'criticality' fields in the output schema with the information from your structured analysis. The 'report' field should contain sections 1-3. The 'suggestedTreatment' field should contain the recommendations from section 4. The 'criticality' field should contain the assessment from section 5.
`,
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
