'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { AnalysisResult } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { explainDiagnosisAction } from '@/app/actions';
import type { ExplainDiagnosisOutput } from '@/ai/flows/explain-diagnosis';

interface ExplanationCardProps {
  imageDataUri?: string | null;
  analysisResult?: AnalysisResult | null;
  isLoading?: boolean;
}

export function ExplanationCard({ imageDataUri, analysisResult, isLoading }: ExplanationCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState<ExplainDiagnosisOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset explanation when a new image is uploaded (analysisResult changes)
    setExplanation(null);
  }, [analysisResult]);

  const handleExplain = async () => {
    if (!imageDataUri || !analysisResult?.findings) return;
    setIsGenerating(true);
    setExplanation(null);

    const result = await explainDiagnosisAction({
      imageDataUri,
      diagnosis: analysisResult.findings,
    });

    if (result.success) {
      setExplanation(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Explanation Failed',
        description: result.error,
      });
    }
    setIsGenerating(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
           <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span>Explainable AI</span>
        </CardTitle>
        <CardDescription>Visually explain how the AI reached its conclusion.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
        {isGenerating ? (
          <div className="w-full h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : explanation ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <Image src={imageDataUri!} alt="Original Scan" width={200} height={200} className="rounded-md border mx-auto" data-ai-hint="xray scan" />
              <p className="text-xs font-semibold mt-2">Original</p>
            </div>
            <div className="text-center">
              <Image src={explanation.explanationImage} alt="AI Explanation" width={200} height={200} className="rounded-md border mx-auto" data-ai-hint="heatmap xray" />
              <p className="text-xs font-semibold mt-2">AI Explanation</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-secondary rounded-md">
            <p className="text-sm text-muted-foreground">Explanation will appear here.</p>
          </div>
        )}
        <Button onClick={handleExplain} disabled={isGenerating || !analysisResult} className="w-full">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {explanation ? 'Regenerate Explanation' : 'Generate Explanation'}
        </Button>
      </CardContent>
    </Card>
  );
}
