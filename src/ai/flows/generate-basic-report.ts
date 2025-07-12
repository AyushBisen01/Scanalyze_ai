'use server';

/**
 * @fileOverview Generates a basic, image-only diagnostic report.
 *
 * - generateBasicReport - A function that generates the basic report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateBasicReportInputSchema, GenerateBasicReportOutputSchema, type GenerateBasicReportInput, type GenerateBasicReportOutput } from '@/app/actions';


export async function generateBasicReport(
  input: GenerateBasicReportInput
): Promise<GenerateBasicReportOutput> {
  return generateBasicReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBasicReportPrompt',
  input: {schema: GenerateBasicReportInputSchema},
  output: {schema: GenerateBasicReportOutputSchema},
  prompt: `You are an expert radiologist AI. Your task is to create a clear, structured, image-only diagnostic report in Markdown format based on the findings provided. Do not invent patient data.

**Analyze the provided findings:**
- Key Findings: {{{findings}}}
- Detected Anomalies: {{{anomalies}}}

**MANDATORY REPORT STRUCTURE - Populate all sections of this template based *only* on the provided findings:**

# 🧠 **RadioAgent Image-Based Diagnostic Report**

### 📌 **Findings Summary**
[Analyze the findings and create a Markdown table with the following columns: 'Region / Structure', 'Abnormality Detected', 'Confidence (%)', 'Severity', 'Notes'. Populate this table with at least 5-7 key regions inferred from the findings (e.g., Lungs, Heart, Pleura). For each region, describe the finding, provide a realistic confidence score as a number, and a severity ('Normal', 'Mild', 'Moderate', 'Severe', or '-').]

---

### 🧠 **Explainable AI Output (XAI - Grad-CAM)**

The following regions were most influential in the model’s diagnostic reasoning:
[Provide a bulleted list summarizing which areas would have the highest activation on a heatmap based on the severity of the findings. e.g., "* 🔴 **Left Lung Lower Zone**: High-activation area indicating likely pneumonia."]

---

### 📋 **Automated Interpretation (Natural Language)**
> [Based on your analysis of the findings, provide a concise, natural language summary of the most critical findings. Mention the primary diagnosis, any significant secondary findings, and their clinical relevance.]

---

### 📈 **Model Confidence & Performance Metrics**

| Parameter              | Value |
| ---------------------- | ----- |
| Overall Confidence     | [Calculate a realistic average confidence based on the findings table]% |
| [Finding 1] Detection  | [Confidence for Finding 1]% |
| [Finding 2] Detection  | [Confidence for Finding 2]% |
| Average False Positive | 1.7%  |
| Average False Negative | 2.0%  |

---

### 🔍 **Recommended AI Actions**
[Provide a bulleted list of 2-3 clear, actionable recommendations based *only* on the findings. Suggestions may include further tests (e.g., CT scan), or specialist referrals.]

---

### ⚠️ **Disclaimer**
> *This is an AI-generated image-based diagnostic analysis with no clinical context. It must not be used as a standalone diagnosis tool and should be reviewed by a licensed medical professional.*

Now, generate the complete report by filling in the 'markdownReport' field in the output schema with the fully populated Markdown text.
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
