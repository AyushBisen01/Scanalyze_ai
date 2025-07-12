'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Printer, Loader2, Sparkles } from 'lucide-react';
import { generateReportAction } from '@/app/actions';
import type { GenerateDetailedReportOutput } from '@/ai/flows/generate-detailed-report';

interface ReportCardProps {
  imageDataUri?: string | null;
  analysisResult?: AnalysisResult | null;
  detailedReport?: GenerateDetailedReportOutput | null;
  setDetailedReport: (report: GenerateDetailedReportOutput | null) => void;
  isLoading?: boolean;
}

export function ReportCard({ imageDataUri, analysisResult, detailedReport, setDetailedReport, isLoading }: ReportCardProps) {
  const [patientHistory, setPatientHistory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!imageDataUri || !analysisResult) return;
    setIsGenerating(true);
    setDetailedReport(null);

    const result = await generateReportAction({
      imageDataUri,
      findings: analysisResult.findings,
      patientHistory: patientHistory || 'No history provided.',
    });

    if (result.success) {
      setDetailedReport(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: result.error,
      });
    }
    setIsGenerating(false);
  };

  const handleDownloadTxt = () => {
    if (!detailedReport) return;
    const reportText = `
CRITICALITY: ${detailedReport.criticality.toUpperCase()}

DETAILED REPORT:
${detailedReport.report}

SUGGESTED TREATMENT / NEXT STEPS:
${detailedReport.suggestedTreatment}
    `;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'radioagent_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Detailed Report</span>
        </CardTitle>
        <CardDescription>Enter patient history and generate a comprehensive report.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {!detailedReport ? (
          <>
            <div>
              <label htmlFor="patient-history" className="text-sm font-medium">Patient History (Optional)</label>
              <Textarea
                id="patient-history"
                placeholder="e.g., 45-year-old male, non-smoker, history of pneumonia..."
                value={patientHistory}
                onChange={(e) => setPatientHistory(e.target.value)}
                className="mt-2"
                rows={4}
                disabled={isGenerating}
              />
            </div>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Report
            </Button>
          </>
        ) : (
          <div id="printable-report" className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Criticality</h4>
              <Badge variant={detailedReport.criticality === 'critical' ? 'destructive' : 'secondary'}>
                {detailedReport.criticality}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Report</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary p-3 rounded-md">{detailedReport.report}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Suggested Treatment</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary p-3 rounded-md">{detailedReport.suggestedTreatment}</p>
            </div>
          </div>
        )}
      </CardContent>
      {detailedReport && (
        <CardFooter className="gap-2 no-print">
          <Button variant="outline" onClick={handleDownloadTxt} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download .txt
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
