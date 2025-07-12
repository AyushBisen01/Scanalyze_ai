'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadCard } from './image-upload-card';
import { AnalysisCard } from './analysis-card';
import { ReportCard } from './report-card';
import { ExplanationCard } from './explanation-card';
import { AssistantCard } from './assistant-card';
import { SymptomCorrelatorCard } from './symptom-correlator-card';
import { performAnalysisAction } from '@/app/actions';

export function DashboardClient() {
  const [imageDataUris, setImageDataUris] = useState<string[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setImageDataUris(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const handleImageUpload = async (dataUris: string[]) => {
    resetState();
    setImageDataUris(dataUris);
    setIsAnalyzing(true);
    
    const result = await performAnalysisAction(dataUris);

    if (result.success) {
      setAnalysisResult(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
      setImageDataUris(null);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto max-w-7xl py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 gap-6">
        <ImageUploadCard
          onImageUpload={handleImageUpload}
          isAnalyzing={isAnalyzing}
          onClear={resetState}
          hasImages={!!(imageDataUris && imageDataUris.length > 0)}
        />

        {(isAnalyzing || analysisResult) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalysisCard isLoading={isAnalyzing} result={analysisResult} />
            <ExplanationCard isLoading={isAnalyzing} imageDataUri={imageDataUris ? imageDataUris[0] : null} analysisResult={analysisResult} />
          </div>
        )}
        
        {(isAnalyzing || analysisResult) && (
           <div className="grid grid-cols-1 gap-6">
             <ReportCard isLoading={isAnalyzing} imageDataUri={imageDataUris ? imageDataUris[0] : null} analysisResult={analysisResult} />
           </div>
        )}

        {analysisResult && (
          <>
            <SymptomCorrelatorCard analysisResult={analysisResult} />
            <AssistantCard analysisResult={analysisResult} />
          </>
        )}
      </div>
    </div>
  );
}
