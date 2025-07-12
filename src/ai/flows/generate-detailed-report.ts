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
  prompt: `You are an expert radiologist and an AI-powered clinical decision support system. Your task is to generate a comprehensive, structured diagnostic report based on a medical image and patient data.
The report MUST be detailed, clinically relevant, and formatted precisely as the template below. Analyze the image and patient data to populate every section.

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
## 📌 **Findings Summary – Structured Radiology Format (Enhanced for Clinical Use)**

---

### 🫁 **Left Lung**

* **Finding:** [Describe the primary finding for this region, e.g., "Airspace consolidation"]

* **Confidence Level:** [Provide a numerical percentage, e.g., "**97.1%**"] ([State High/Medium/Low])

* **Severity Assessment:** [State "Severe", "Moderate", "Mild", or "Normal"]

* **Detailed Notes:**
[Provide detailed radiological observations for this finding. Be descriptive and technical.]

* **Clinical Suggestion:**
[Suggest a specific clinical action, like recommended medication, tests, or management.]

* **Emerging Disease Alert (Prediction):**
[Based on patterns, suggest a potential differential diagnosis or future risk. Be specific.]

---

### 🫁 **Right Lung**

* **Finding:** [Describe the primary finding for this region]

* **Confidence Level:** [Provide a numerical percentage] ([State High/Medium/Low])

* **Severity Assessment:** [State "Severe", "Moderate", "Mild", or "Normal"]

* **Detailed Notes:**
[Provide detailed radiological observations for this finding.]

* **Clinical Suggestion:**
[Suggest a specific clinical action.]

* **Emerging Disease Alert (Prediction):**
[Suggest a potential differential diagnosis or future risk.]

---

### ❤️ **Cardiac Silhouette**

* **Finding:** [Describe the finding for the heart]

* **Confidence Level:** [Provide a numerical percentage]

* **Detailed Notes:**
[Provide detailed radiological observations for this finding.]

* **Clinical Suggestion:**
[Suggest a specific clinical action.]

---

### 🌬️ **Pleural Region**

* **Finding:** [Describe the finding for the pleura]

* **Confidence Level:** [Provide a numerical percentage]

* **Detailed Notes:**
[Provide detailed radiological observations for this finding.]

* **Clinical Suggestion:**
[Suggest a specific clinical action.]

---

### 🦴 **Skeletal Structures**

* **Finding:** [Describe the finding for bones]

* **Confidence Level:** [Provide a numerical percentage]

* **Detailed Notes:**
[Provide detailed radiological observations for this finding.]

* **Clinical Suggestion:**
[Suggest a specific clinical action.]

---

### 🫁 **Mediastinum & Trachea**

* **Finding:** [Describe the finding for the mediastinum]

* **Confidence Level:** [Provide a numerical percentage]

* **Detailed Notes:**
[Provide detailed radiological observations for this finding.]

* **Clinical Suggestion:**
[Suggest a specific clinical action.]

---

## 🔍 **AI-Driven Clinical Recommendations Summary**

[Provide a numbered list of 3-5 clear, consolidated, actionable recommendations based on the overall findings.]

---

### ⚠️ **Medical Disclaimer**

> *This is an AI-generated diagnostic suggestion and should only be used to assist clinical judgment. Final diagnosis, prescriptions, and interventions should be made by a licensed healthcare provider based on patient history, lab tests, and physical examination.*
---

Now, generate the complete report by filling in the 'markdownReport' field in the output schema with the fully populated Markdown text. Ensure all sections are filled out comprehensively and accurately based on the image analysis.
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
