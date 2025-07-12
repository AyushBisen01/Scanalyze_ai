'use client';

import { useState, useEffect } from 'react';
import type { AnalysisResult } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Loader2, Sparkles, User, Stethoscope as StethoscopeIcon } from 'lucide-react';
import { generateReportAction, generateBasicReportAction } from '@/app/actions';
import type { GenerateDetailedReportInput } from '@/ai/flows/generate-detailed-report';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';


interface ReportCardProps {
  imageDataUri?: string | null;
  analysisResult?: AnalysisResult | null;
  isLoading?: boolean;
}

export function ReportCard({ imageDataUri, analysisResult, isLoading }: ReportCardProps) {
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
  });
  const [basicReport, setBasicReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateAndSetBasicReport = async () => {
      if (analysisResult) {
        setIsGenerating(true);
        setBasicReport(null);
        const result = await generateBasicReportAction(analysisResult);
        if (result.success) {
          setBasicReport(result.data.markdownReport);
        } else {
          toast({
            variant: 'destructive',
            title: 'Basic Report Failed',
            description: result.error,
          });
        }
        setIsGenerating(false);
      } else {
        setBasicReport(null);
      }
    };
    generateAndSetBasicReport();
  }, [analysisResult, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleDownloadPdf = async (detailedReportMarkdown: string) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const reportElement = document.createElement('div');
    // Enhanced styling for the report content
    const reportContentHtml = `<div class="prose prose-sm max-w-none p-5 font-sans">${detailedReportMarkdown}</div>`;
    reportElement.innerHTML = reportContentHtml;
    
    // Append to body to render for canvas capture
    document.body.appendChild(reportElement);

    // Add styles to the document head for html2canvas to use
    const style = document.createElement('style');
    style.innerHTML = `
      .prose { color: #333; }
      .prose h1, .prose h2, .prose h3 { font-weight: 600; }
      .prose h1 { font-size: 24px; }
      .prose h2 { font-size: 20px; }
      .prose h3 { font-size: 18px; margin-top: 1em; }
      .prose hr { border-top: 1px solid #ccc; margin: 1em 0; }
      .prose ul { list-style-type: disc; padding-left: 20px; }
      .prose li { margin-bottom: 0.5em; }
      .prose strong { font-weight: bold; }
      .prose blockquote { border-left: 4px solid #ccc; padding-left: 1em; font-style: italic; }
      .prose table { width: 100%; border-collapse: collapse; }
      .prose th, .prose td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      .prose th { background-color: #f2f2f2; }
    `;
    document.head.appendChild(style);

    try {
        const canvas = await html2canvas(reportElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        const pageMargin = 10;
        const pdfHeight = pdf.internal.pageSize.getHeight() - (pageMargin * 2);

        pdf.addImage(imgData, 'PNG', pageMargin, pageMargin, pdfWidth - (pageMargin * 2), imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', pageMargin, position, pdfWidth - (pageMargin*2), imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('radioagent_detailed_report.pdf');
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({
            variant: 'destructive',
            title: 'PDF Generation Failed',
            description: 'There was an error creating the PDF file.',
        });
    } finally {
        document.body.removeChild(reportElement);
        document.head.removeChild(style);
    }
  };
  

  const handleGenerateReport = async () => {
    if (!imageDataUri || !analysisResult) return;
    setIsGenerating(true);

    const input: GenerateDetailedReportInput = {
      imageDataUri,
      ...patientInfo,
    };

    const result = await generateReportAction(input);

    if (result.success) {
      toast({
        title: "Detailed Report Generated",
        description: "Your PDF report is now downloading.",
      });
      await handleDownloadPdf(result.data.markdownReport);
    } else {
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: result.error,
      });
    }
    setIsGenerating(false);
    setIsDialogOpen(false); // Close the dialog
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>AI Diagnostic Report</span>
        </CardTitle>
        <CardDescription>Initial AI-generated analysis based on the image.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
        {(isGenerating && !basicReport) || isLoading ? (
          <div className="w-full space-y-4 py-4">
             <Skeleton className="h-6 w-1/2" />
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-6 w-1/3" />
             <Skeleton className="h-24 w-full" />
          </div>
        ) : basicReport ? (
          <div className="prose prose-sm dark:prose-invert max-w-none w-full border rounded-md p-4 bg-secondary/30">
             <ReactMarkdown>{basicReport}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Upload an image to generate a report.</p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={!analysisResult || isGenerating}>
              <Download className="mr-2 h-4 w-4" />
              Generate & Download Detailed Report (PDF)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enter Patient Information for Detailed Report</DialogTitle>
              <DialogDescription>
                This information will be used to generate the final diagnostic PDF report. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isGenerating}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate & Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
