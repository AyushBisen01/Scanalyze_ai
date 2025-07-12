'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/app/actions';
import type { GenerateDetailedReportOutput } from '@/ai/flows/generate-detailed-report';
import type { ExplainDiagnosisOutput } from '@/ai/flows/explain-diagnosis';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadCard } from './image-upload-card';
import { AnalysisCard } from './analysis-card';
import { ReportCard } from './report-card';
import { ExplanationCard } from './explanation-card';
import { AssistantCard } from './assistant-card';
import { SymptomCorrelatorCard } from './symptom-correlator-card';
import { performAnalysisAction } from '@/app/actions';

export function DashboardClient() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [detailedReport, setDetailedReport] = useState<GenerateDetailedReportOutput | null>(null);
  const [explanation, setExplanation] = useState<ExplainDiagnosisOutput | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setImageDataUri(null);
    setAnalysisResult(null);
    setDetailedReport(null);
    setExplanation(null);
    setIsAnalyzing(false);
  };

  const handleImageUpload = async (dataUri: string) => {
    resetState();
    setImageDataUri(dataUri);
    setIsAnalyzing(true);
    
    const result = await performAnalysisAction(dataUri);

    if (result.success) {
      setAnalysisResult(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
      setImageDataUri(null);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto max-w-7xl py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="md:col-span-2 xl:col-span-3">
          <ImageUploadCard
            onImageUpload={handleImageUpload}
            isAnalyzing={isAnalyzing}
            onClear={resetState}
            hasImage={!!imageDataUri}
          />
        </div>

        {isAnalyzing && (
          <>
            <div className="md:col-span-2 xl:col-span-1">
              <AnalysisCard isLoading={true} />
            </div>
            <ExplanationCard isLoading={true} />
            <ReportCard isLoading={true} />
          </>
        )}

        {analysisResult && imageDataUri && (
          <>
            <div className="md:col-span-2 xl:col-span-1">
              <AnalysisCard result={analysisResult} />
            </div>
            
            <ReportCard
              imageDataUri={imageDataUri}
              analysisResult={analysisResult}
              detailedReport={detailedReport}
              setDetailedReport={setDetailedReport}
            />

            <ExplanationCard
              imageDataUri={imageDataUri}
              analysisResult={analysisResult}
              explanation={explanation}
              setExplanation={setExplanation}
            />
            
            <div className="md:col-span-2 xl:col-span-3">
              <SymptomCorrelatorCard analysisResult={analysisResult} />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <AssistantCard analysisResult={analysisResult} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
