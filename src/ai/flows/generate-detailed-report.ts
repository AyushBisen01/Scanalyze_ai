// This file is machine-generated - edit with caution!
'use server';

/**
 * @fileOverview Generates a detailed, doctor-level report based on image analysis.
 *
 * - generateDetailedReport - A function that generates the detailed report.
 * - GenerateDetailedReportInput - The input type for the generateDetailedReport function.
 * - GenerateDetailedReportOutput - The return type for the generateDetailedReportOutput function.
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
  prompt: `You are an expert radiologist AI. Your task is to create a comprehensive, doctor-level diagnostic report in Markdown format.
Analyze the provided medical image and patient data to populate the following template.
The report MUST be detailed, well-structured, and clear for other medical professionals.
Fill in all sections based on your analysis of the image.

**Analyze the provided information:**
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

**MANDATORY REPORT STRUCTURE - Populate all sections of this template:**

# 🏥 **RadioAgent Diagnostic Report**
**Automated Radiology Image Analysis & Disease Identification**
---
### 📌 **Patient Information**
| Field | Value |
|---|---|
| **Patient Name** | {{{patientName}}} |
| **Patient ID** | {{{patientId}}} |
| **Date of Birth** | {{{dateOfBirth}}} |
| **Age / Gender** | [Calculate Age from DOB and Scan Date if possible, otherwise leave as N/A] / {{{gender}}} |
| **Referring Physician** | {{{referringPhysician}}} |
| **Hospital / Unit** | {{{hospital}}} |
| **Scan Date** | {{{scanDate}}} |
| **Modality** | {{{modality}}} |
---
### 📖 **Clinical History**
> {{{clinicalHistory}}}
---
### 🧠 **AI Analysis Summary (Natural Language)**
> [Based on your analysis of the image and clinical history, provide a concise, natural language summary of the most critical findings. Mention the primary diagnosis, any significant secondary findings, and their clinical relevance.]
---
### 🔬 **Detailed AI Findings**
[Analyze the image and create a Markdown table with the following columns: 'Region / Organ', 'Abnormality Detected', 'Confidence (%)', 'Severity', 'Notes'. Populate this table with at least 5-7 key regions (e.g., Lungs, Heart, Pleura, Ribs, Mediastinum). For each region, describe the finding (even if normal), provide a confidence score as a number, and a severity ('Normal', 'Mild', 'Moderate', 'Severe', or '-').]
---
### 📅 **Comparison with Previous Scans**
> [Based on the 'Previous Scan Data' field, compare it with the current findings. Note any new findings, changes in existing conditions, or stability. If no previous data, state "No previous scans available for comparison."]
---
### 📋 **AI Recommendations**
[Provide a numbered list of 3-4 clear, actionable recommendations based on the findings. Suggestions may include further tests (e.g., CT scan, biopsy), specialist referrals (e.g., Pulmonologist), or immediate clinical actions.]
---
### 🧾 **Auto-Generated Structured Report Text (Editable by Radiologist)**
> [Generate a concise, formal paragraph summarizing the key findings, suitable for direct inclusion in a final radiology report. This should be a technical summary.]
---
### ⚠️ **Medical Disclaimer**
> *This report is AI-generated and intended to support, not replace, the diagnosis of a licensed radiologist or clinician. All recommendations must be validated by qualified professionals.*

---
Now, generate the complete report by filling in the 'markdownReport' field in the output schema with the fully populated Markdown text.
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
