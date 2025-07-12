'use server';

/**
 * @fileOverview Generates a basic, image-only diagnostic report.
 *
 * - generateBasicReport - A function that generates the basic report.
 */

import {ai} from '@/ai/genkit';
import { GenerateBasicReportInputSchema, GenerateBasicReportOutputSchema, type GenerateBasicReportInput, type GenerateBasicReportOutput } from '@/app/types';


export async function generateBasicReport(
  input: GenerateBasicReportInput
): Promise<GenerateBasicReportOutput> {
  return generateBasicReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBasicReportPrompt',
  input: {schema: GenerateBasicReportInputSchema},
  output: {schema: GenerateBasicReportOutputSchema},
  prompt: `You are an expert radiologist AI. Your task is to create a clear, structured, image-only diagnostic report in Markdown format based on the findings provided. Follow the formatting instructions precisely.

**Analyze the provided findings:**
- Key Findings: {{{findings}}}
- Detected Anomalies: {{{anomalies}}}

**MANDATORY REPORT STRUCTURE - Populate all sections of this template based *only* on the provided findings. Use Title Case for all headers.**

# 🧠 RadioAgent Image-Based Diagnostic Report
*Scan Type: Chest X-Ray (PA View) | AI Model: RadioAgent v1.3*
***

### 📌 Findings Summary
[Analyze the findings and create a perfectly formatted Markdown table with the following columns: 'Region / Structure', 'Abnormality Detected', 'Confidence (%)', 'Severity', 'Notes'. Combine related findings to avoid redundancy (e.g., use 'Left Lung' instead of multiple sub-regions unless necessary). Populate this table with the most critical findings. Ensure notes are concise and clinically relevant.]

***

### 🧠 Explainable AI Output (XAI - Grad-CAM)
The following regions were most influential in the model’s diagnostic reasoning:
[Provide a bulleted list summarizing which areas would have the highest activation on a heatmap. Be specific about location and the finding. e.g., "* 🔴 **Left Lung Lower Zone**: High-activation area indicating likely pneumonia."]

***

### 📋 Automated Interpretation
> [Based on your analysis of the findings, provide a concise, natural language summary of the most critical findings. Mention the primary diagnosis, any significant secondary findings, and their clinical relevance.]

***

### 📈 Model Confidence & Performance Metrics
[Create a perfectly formatted Markdown table with the following columns: 'Parameter', 'Value'.]
| Parameter              | Value |
| ---------------------- | ----- |
| Overall Confidence     | [Calculate a realistic average confidence based on the findings table]% |
| [Finding 1] Detection  | [Confidence for Finding 1]% |
| [Finding 2] Detection  | [Confidence for Finding 2]% |
| Average False Positive | 1.7%  |
| Average False Negative | 2.0%  |

***

### 🔍 Recommended AI Actions
[Provide a bulleted list of 2-3 clear, actionable recommendations based *only* on the findings. Suggestions may include further tests or specialist referrals. Use icons for clarity.]

***

### ⚠️ Disclaimer
> *This is an AI-generated image-based diagnostic analysis with no clinical context. It must not be used as a standalone diagnosis tool and should be reviewed by a licensed medical professional.*

Now, generate the complete report by filling in the 'markdownReport' field in the output schema with the fully populated Markdown text. Ensure all Markdown tables are syntactically perfect with no extra pipes or formatting errors.
`,
});

const generateBasicReportFlow = ai.defineFlow(
  {
    name: 'generateBasicReportFlow',
    inputSchema: GenerateBasicReportInputSchema,
    outputSchema: GenerateBasicReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
