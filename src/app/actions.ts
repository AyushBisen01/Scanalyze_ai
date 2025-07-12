'use server';

import { ai } from '@/ai/genkit';
import { analyzeMedicalImage } from '@/ai/flows/analyze-medical-image';
import { detectAnomalies } from '@/ai/flows/detect-anomalies';
import { generateDetailedReport } from '@/ai/flows/generate-detailed-report';
import type { GenerateDetailedReportInput, GenerateDetailedReportOutput } from '@/ai/flows/generate-detailed-report';
import { explainDiagnosis } from '@/ai/flows/explain-diagnosis';
import type { ExplainDiagnosisInput, ExplainDiagnosisOutput } from '@/ai/flows/explain-diagnosis';
import { correlateSymptoms } from '@/ai/flows/correlate-symptoms';
import type { CorrelateSymptomsInput, CorrelateSymptomsOutput } from '@/ai/flows/correlate-symptoms';
import { generateBasicReport, type GenerateBasicReportOutput } from '@/ai/flows/generate-basic-report';


export type AnalysisResult = {
  findings: string;
  anomalies: string;
};

export async function performAnalysisAction(
  imageDataUri: string
): Promise<{ success: true, data: AnalysisResult } | { success: false, error: string }> {
  try {
    const [analysis, anomaliesResult] = await Promise.all([
      analyzeMedicalImage({ photoDataUri: imageDataUri }),
      detectAnomalies({ photoDataUri: imageDataUri }),
    ]);

    return {
      success: true,
      data: {
        findings: analysis.findings,
        anomalies: anomaliesResult.anomalies,
      },
    };
  } catch (error) {
    console.error('Error in performAnalysisAction:', error);
    return { success: false, error: 'An error occurred during image analysis.' };
  }
}

export async function generateBasicReportAction(
  analysisResult: AnalysisResult
): Promise<{ success: true, data: GenerateBasicReportOutput } | { success: false, error: string }> {
  try {
    const report = await generateBasicReport(analysisResult);
    return { success: true, data: report };
  } catch (error) {
    console.error('Error in generateBasicReportAction:', error);
    return { success: false, error: 'An error occurred while generating the basic report.' };
  }
}

export async function generateReportAction(
  input: GenerateDetailedReportInput
): Promise<{ success: true, data: GenerateDetailedReportOutput } | { success: false, error: string }> {
  try {
    const report = await generateDetailedReport(input);
    return { success: true, data: report };
  } catch (error) {
    console.error('Error in generateReportAction:', error);
    return { success: false, error: 'An error occurred while generating the report.' };
  }
}

export async function explainDiagnosisAction(
  input: ExplainDiagnosisInput
): Promise<{ success: true, data: ExplainDiagnosisOutput } | { success: false, error: string }> {
  try {
    const explanation = await explainDiagnosis(input);
    return { success: true, data: explanation };
  } catch (error) {
    console.error('Error in explainDiagnosisAction:', error);
    return { success: false, error: 'An error occurred while generating the explanation.' };
  }
}

export async function getConversationalResponse(
  context: string,
  question: string
): Promise<{ success: true, data: string } | { success: false, error: string }> {
  try {
    const response = await ai.generate({
      prompt: `You are an intelligent medical assistant. A radiologist has a question about some findings.
      Provide a concise, helpful, and professional response based on the context. Do not repeat the context or the question in your answer.
      
      Context: "${context}"
      
      Question: "${question}"`,
    });
    return { success: true, data: response.text };
  } catch (error) {
    console.error('Error in getConversationalResponse:', error);
    return { success: false, error: 'An error occurred while getting a response.' };
  }
}

export async function correlateSymptomsAction(
  input: CorrelateSymptomsInput
): Promise<{ success: true, data: CorrelateSymptomsOutput } | { success: false, error: string }> {
  try {
    const result = await correlateSymptoms(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in correlateSymptomsAction:', error);
    return { success: false, error: 'An error occurred during symptom correlation.' };
  }
}
