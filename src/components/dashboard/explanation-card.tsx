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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ExplanationCardProps {
  imageDataUris?: string[] | null;
  analysisResult?: AnalysisResult | null;
  isLoading?: boolean;
}

type ExplanationState = {
  [key: string]: {
    isGenerating: boolean;
    explanation: ExplainDiagnosisOutput | null;
  };
};

export function ExplanationCard({ imageDataUris, analysisResult, isLoading }: ExplanationCardProps) {
  const [explanations, setExplanations] = useState<ExplanationState>({});
  const { toast } = useToast();

  useEffect(() => {
    // Reset explanations when a new analysis starts
    setExplanations({});
  }, [analysisResult]);

  const handleExplain = async (imageUri: string, index: number) => {
    if (!analysisResult?.findings) return;

    setExplanations(prev => ({
      ...prev,
      [imageUri]: { ...prev[imageUri], isGenerating: true, explanation: null },
    }));

    const result = await explainDiagnosisAction({
      imageDataUri: imageUri,
      diagnosis: analysisResult.findings,
    });

    if (result.success) {
       setExplanations(prev => ({
        ...prev,
        [imageUri]: { ...prev[imageUri], isGenerating: false, explanation: result.data },
      }));
    } else {
      toast({
        variant: 'destructive',
        title: `Explanation Failed for Image ${index + 1}`,
        description: result.error,
      });
      setExplanations(prev => ({
        ...prev,
        [imageUri]: { ...prev[imageUri], isGenerating: false },
      }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!imageDataUris || imageDataUris.length === 0) return null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span>Explainable AI</span>
        </CardTitle>
        <CardDescription>Visually explain how the AI reached its conclusion for each image.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
        <Carousel className="w-full max-w-xl" opts={{ loop: true }}>
          <CarouselContent>
            {imageDataUris.map((uri, index) => {
              const currentExplanation = explanations[uri];
              const isGenerating = currentExplanation?.isGenerating;
              const explanation = currentExplanation?.explanation;

              return (
                <CarouselItem key={index}>
                  <div className="p-1 space-y-4">
                     <p className="text-center font-semibold text-sm">Image {index + 1} of {imageDataUris.length}</p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="text-center">
                        <Image src={uri} alt={`Original Scan ${index+1}`} width={200} height={200} className="rounded-md border mx-auto object-cover aspect-square" data-ai-hint="xray scan" />
                        <p className="text-xs font-semibold mt-2">Original</p>
                      </div>
                      <div className="text-center space-y-2">
                        {isGenerating ? (
                           <div className="w-full h-[200px] flex items-center justify-center bg-secondary rounded-md">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                           </div>
                        ) : explanation ? (
                          <Image src={explanation.explanationImage} alt={`AI Explanation ${index+1}`} width={200} height={200} className="rounded-md border mx-auto object-cover aspect-square" data-ai-hint="heatmap xray" />
                        ) : (
                          <div className="w-full h-[200px] flex items-center justify-center bg-secondary rounded-md">
                            <p className="text-xs text-muted-foreground">Explanation will appear here.</p>
                          </div>
                        )}
                        <p className="text-xs font-semibold">AI Explanation</p>
                      </div>
                    </div>

                    {isGenerating ? (
                      <Skeleton className="h-10 w-full" />
                    ) : explanation?.explanationText ? (
                      <div className="text-center bg-secondary p-2 rounded-md">
                        <p className="text-xs text-secondary-foreground italic">{explanation.explanationText}</p>
                      </div>
                    ) : null }

                    <Button onClick={() => handleExplain(uri, index)} disabled={isGenerating || !analysisResult} className="w-full">
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      {explanation ? 'Regenerate Explanation' : 'Generate Explanation'}
                    </Button>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {imageDataUris.length > 1 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
