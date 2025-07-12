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
  patientName: z.string().optional().default('N/A'),
  patientId: z.string().optional().default('N/A'),
  dateOfBirth: z.string().optional().default('N/A'),
  gender: z.string().optional().default('N/A'),
  referringPhysician: z.string().optional().default('N/A'),
  hospital: z.string().optional().default('N/A'),
  scanDate: z.string().optional().default('N/A'),
  modality: z.string().optional().default('N/A'),
  clinicalHistory: z.string().optional().default('Not Provided'),
  previousScanData: z.string().optional().default('No previous scans available for comparison.'),
});
export type GenerateDetailedReportInput = z.infer<typeof GenerateDetailedReportInputSchema>;

const GenerateDetailedReportOutputSchema = z.object({
  markdownReport: z.string().describe('The full, detailed, multi-section clinical report formatted in Markdown.'),
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
  prompt: `You are an expert radiologist AI, tasked with creating a comprehensive, doctor-level diagnostic report in Markdown format. The report must be detailed, well-structured, and clear for other medical professionals.

Analyze the provided information:
- Image: {{media url=imageDataUri}}
- Patient Name: {{{patientName}}}
- Patient ID: {{{patientId}}}
- Date of Birth: {{{dateOfBirth}}}
- Gender: {{{gender}}}
- Referring Physician: {{{referringPhysician}}}
- Hospital / Unit: {{{hospital}}}
- Scan Date: {{{scanDate}}}
- Modality: {{{modality}}}
- Clinical History: {{{clinicalHistory}}}
- Previous Scan Data: {{{previousScanData}}}

Generate a complete report in Markdown. The report MUST include all the following sections exactly as specified. Use markdown tables, bolding, and headers to structure the report.

**REPORT STRUCTURE:**

# 🏥 RadioAgent Diagnostic Report
**Automated Radiology Image Analysis & Disease Identification**
---
### 📌 Patient Information
| Field | Value |
|---|---|
| **Patient Name** | {{{patientName}}} |
| **Patient ID** | {{{patientId}}} |
| **Date of Birth** | {{{dateOfBirth}}} |
| **Age / Gender** | [Calculate Age from DOB and Scan Date] / {{{gender}}} |
| **Referring Physician** | {{{referringPhysician}}} |
| **Hospital / Unit** | {{{hospital}}} |
| **Scan Date** | {{{scanDate}}} |
| **Modality** | {{{modality}}} |
---
### 📖 Clinical History
> {{{clinicalHistory}}}
---
### 🧠 AI Analysis Summary (Natural Language)
> [Provide a concise, natural language summary of the most critical findings. Mention the primary diagnosis, any significant secondary findings, and their clinical relevance based on the provided history.]
---
### 🔬 Detailed AI Findings
[Create a Markdown table with the following columns: 'Region / Organ', 'Abnormality Detected', 'Confidence (%)', 'Severity', 'Notes'. Populate this table by analyzing the image. Include both abnormal and normal findings for key regions like lungs, heart, pleura, etc. Confidence should be a number, Severity should be 'Normal', 'Mild', 'Moderate', or 'Severe'.]
---
### 📅 Comparison with Previous Scans
> [Analyze the 'Previous Scan Data' and compare it with the current findings. Note any new findings, changes in existing conditions, or stability.]
---
### 📋 AI Recommendations
[Provide a numbered list of clear, actionable recommendations based on the findings. Suggestions may include further tests (e.g., CT scan, biopsy), specialist referrals (e.g., Pulmonologist), or immediate clinical actions.]
---
### 🧾 Auto-Generated Structured Report Text (Editable by Radiologist)
> [Generate a concise, formal paragraph summarizing the key findings, suitable for direct inclusion in a final radiology report.]
---
### ⚠️ Medical Disclaimer
> *This report is AI-generated and intended to support, not replace, the diagnosis of a licensed radiologist or clinician. All recommendations must be validated by qualified professionals.*

Populate the 'markdownReport' field in the output schema with the complete, formatted Markdown text.
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
