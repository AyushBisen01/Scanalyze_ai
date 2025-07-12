'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { AnalysisResult } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Printer, Loader2, Sparkles, User, Info, Calendar, Stethoscope as StethoscopeIcon } from 'lucide-react';
import { generateReportAction } from '@/app/actions';
import type { GenerateDetailedReportOutput, GenerateDetailedReportInput } from '@/ai/flows/generate-detailed-report';
import { Label } from '@/components/ui/label';

interface ReportCardProps {
  imageDataUri?: string | null;
  analysisResult?: AnalysisResult | null;
  detailedReport?: GenerateDetailedReportOutput | null;
  setDetailedReport: (report: GenerateDetailedReportOutput | null) => void;
  isLoading?: boolean;
}

export function ReportCard({ imageDataUri, analysisResult, detailedReport, setDetailedReport, isLoading }: ReportCardProps) {
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    patientId: '',
    dateOfBirth: '',
    gender: '',
    referringPhysician: '',
    hospital: '',
    scanDate: new Date().toISOString().split('T')[0],
    modality: 'Chest X-Ray (PA View)',
    clinicalHistory: '',
    previousScanData: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateReport = async () => {
    if (!imageDataUri || !analysisResult) return;
    setIsGenerating(true);
    setDetailedReport(null);

    const input: GenerateDetailedReportInput = {
      imageDataUri,
      ...patientInfo,
    };

    const result = await generateReportAction(input);

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
    const blob = new Blob([detailedReport.markdownReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'radioagent_report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printableArea = document.getElementById('printable-report');
    if (printableArea) {
      const printWindow = window.open('', '', 'height=800,width=1000');
      printWindow?.document.write('<html><head><title>RadioAgent Report</title>');
      // Inject styles
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('');
          } catch (e) {
            console.warn('Could not read stylesheet rules', e);
            return '';
          }
        })
        .join('');
      printWindow?.document.write(`<style>${styles}</style>`);
      printWindow?.document.write('<style>body { padding: 2rem; } @page { size: auto; margin: 0; } .no-print { display: none; }</style>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(printableArea.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.focus();
      setTimeout(() => {
         printWindow?.print();
         printWindow?.close();
      }, 250);
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
        <CardDescription>Enter patient information to generate a comprehensive clinical report.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {!detailedReport ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="patientName">Patient Name</Label><Input id="patientName" value={patientInfo.patientName} onChange={handleInputChange} placeholder="John Doe" disabled={isGenerating} /></div>
              <div><Label htmlFor="patientId">Patient ID</Label><Input id="patientId" value={patientInfo.patientId} onChange={handleInputChange} placeholder="PID-12345" disabled={isGenerating} /></div>
              <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" value={patientInfo.dateOfBirth} onChange={handleInputChange} disabled={isGenerating} /></div>
              <div><Label htmlFor="gender">Gender</Label><Input id="gender" value={patientInfo.gender} onChange={handleInputChange} placeholder="Male" disabled={isGenerating} /></div>
              <div><Label htmlFor="referringPhysician">Referring Physician</Label><Input id="referringPhysician" value={patientInfo.referringPhysician} onChange={handleInputChange} placeholder="Dr. Smith" disabled={isGenerating} /></div>
              <div><Label htmlFor="hospital">Hospital / Unit</Label><Input id="hospital" value={patientInfo.hospital} onChange={handleInputChange} placeholder="City General Hospital" disabled={isGenerating} /></div>
              <div><Label htmlFor="scanDate">Scan Date</Label><Input id="scanDate" type="date" value={patientInfo.scanDate} onChange={handleInputChange} disabled={isGenerating} /></div>
              <div><Label htmlFor="modality">Modality</Label><Input id="modality" value={patientInfo.modality} onChange={handleInputChange} placeholder="e.g., Chest X-Ray" disabled={isGenerating} /></div>
            </div>

            <h3 className="font-semibold text-lg flex items-center gap-2 pt-4"><StethoscopeIcon className="w-5 h-5 text-primary" /> Clinical Details</h3>
            <div>
              <Label htmlFor="clinicalHistory">Clinical History</Label>
              <Textarea id="clinicalHistory" placeholder="e.g., 45-year-old male, non-smoker, history of pneumonia..." value={patientInfo.clinicalHistory} onChange={handleInputChange} className="mt-2" rows={3} disabled={isGenerating} />
            </div>
            <div>
              <Label htmlFor="previousScanData">Previous Scan Comparison Data (Optional)</Label>
              <Textarea id="previousScanData" placeholder="e.g., Findings from last scan (Feb 2025): Lungs clear." value={patientInfo.previousScanData} onChange={handleInputChange} className="mt-2" rows={2} disabled={isGenerating} />
            </div>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Report
            </Button>
          </div>
        ) : (
          <div id="printable-report" className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                table: ({node, ...props}) => <table className="w-full text-left border-collapse" {...props} />,
                th: ({node, ...props}) => <th className="border p-2 font-semibold" {...props} />,
                td: ({node, ...props}) => <td className="border p-2" {...props} />,
              }}
            >
                {detailedReport.markdownReport}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
      {detailedReport && (
        <CardFooter className="flex-wrap gap-2 no-print sm:flex-nowrap">
          <Button variant="outline" onClick={handleDownloadTxt} className="w-full sm:w-auto flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download .md
          </Button>
          <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
           <Button onClick={() => setDetailedReport(null)} className="w-full sm:w-auto flex-1">
              Generate New Report
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
