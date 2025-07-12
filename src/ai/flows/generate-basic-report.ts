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
  prompt: `You are an expert radiologist and an AI-powered clinical decision support system. Your task is to generate a comprehensive, structured diagnostic report based on the provided findings.
The report MUST be detailed, clinically relevant, and formatted precisely as the template below. Analyze the findings to populate every section.

**Analyze the provided information:**
- Key Findings: {{{findings}}}
- Detected Anomalies: {{{anomalies}}}

**MANDATORY REPORT STRUCTURE - Populate all sections of this template:**

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

### ⚠️ **Disclaimer**

> *This is an AI-generated diagnostic suggestion and should only be used to assist clinical judgment. Final diagnosis, prescriptions, and interventions should be made by a licensed healthcare provider based on patient history, lab tests, and physical examination.*
---

Now, generate the complete report by filling in the 'markdownReport' field in the output schema with the fully populated Markdown text. Ensure all sections are filled out comprehensively and accurately based on the findings.
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
