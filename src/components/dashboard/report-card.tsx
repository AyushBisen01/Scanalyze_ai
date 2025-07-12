
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
import type { ExplanationMap } from './explanation-card';
import jsPDF from 'jspdf';

// Function to extract a filename from the report
const getPdfFilename = (markdown: string, patientName?: string): string => {
    const findingMatch = markdown.match(/^\*   \*\*Finding:\*\* \[([^\]]+)\]/m);
    if (findingMatch && findingMatch[1]) {
        const title = findingMatch[1].replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
        return `RadioAgent_Report_${title}.pdf`;
    }

    if (patientName && patientName.trim() !== '') {
        const safePatientName = patientName.replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
        return `RadioAgent_Report_${safePatientName}.pdf`;
    }

    return 'RadioAgent_Detailed_Report.pdf';
};


interface ReportCardProps {
  imageDataUris?: string[] | null;
  analysisResult?: AnalysisResult | null;
  isLoading?: boolean;
  explanations: ExplanationMap;
}

export function ReportCard({ imageDataUris, analysisResult, isLoading, explanations }: ReportCardProps) {
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
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pdfWidth - (margin * 2);
    let yPos = margin;

    // --- PDF HELPER FUNCTIONS ---
    const checkPageBreak = (spaceNeeded: number) => {
        if (yPos + spaceNeeded > pdfHeight - margin) {
            pdf.addPage();
            yPos = margin;
        }
    };
    
    const addWrappedText = (text: string, options: { isBold?: boolean, isItalic?: boolean, indent?: number, isListItem?: boolean, fontSize?: number, isHeading?: boolean } = {}) => {
        const { isBold = false, isItalic = false, indent = 0, isListItem = false, fontSize = 10, isHeading = false } = options;
        
        let processedText = text;
        const potentialBold = text.match(/\*\*(.*?)\*\*/);
        if (potentialBold) {
            const prefixMatch = text.match(/^(.*?)\*\*/);
            const prefix = prefixMatch ? prefixMatch[1] : '';
            const boldText = potentialBold[1];
            const suffix = text.substring(text.indexOf(boldText) + boldText.length + 2);

            if (prefix) addWrappedText(prefix, {...options, isBold: false});
            addWrappedText(boldText, {...options, isBold: true});
            if (suffix) addWrappedText(suffix, {...options, isBold: false});
            return;
        }

        const fontStyle = isBold && isItalic ? 'bolditalic' : isBold ? 'bold' : isItalic ? 'italic' : 'normal';
        pdf.setFont('helvetica', fontStyle);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(isHeading ? '#000000' : '#333333');
        
        const fullIndent = margin + indent + (isListItem ? 5 : 0);
        if(isListItem) {
          pdf.text('•', margin + indent + 2, yPos);
        }

        const lines = pdf.splitTextToSize(processedText, contentWidth - indent - (isListItem ? 5 : 0));
        lines.forEach((line: string) => {
            checkPageBreak(fontSize * 0.35); // Approximate line height
            pdf.text(line, fullIndent, yPos);
            yPos += fontSize * 0.5;
        });
    };

    const addSectionTitle = (title: string) => {
      checkPageBreak(20);
      yPos += 5; // Extra space before section title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(title, margin, yPos);
      yPos += 5;
      pdf.setDrawColor(220, 220, 220); // #dddddd
      pdf.line(margin, yPos, pdfWidth - margin, yPos);
      yPos += 8;
    };

    // --- START BUILDING PDF ---
    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(33, 150, 243); // A nice blue color
    pdf.text('RadioAgent Diagnostic Report', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Patient Info
    addSectionTitle('Patient Information');
    const info = [
        `Patient Name: ${patientInfo.patientName || 'N/A'}`,
        `Patient ID: ${patientInfo.patientId || 'N/A'}`,
        `Date of Birth: ${patientInfo.dateOfBirth || 'N/A'}`,
        `Gender: ${patientInfo.gender || 'N/A'}`,
        `Referring Physician: ${patientInfo.referringPhysician || 'N/A'}`,
        `Hospital / Unit: ${patientInfo.hospital || 'N/A'}`,
        `Scan Date: ${patientInfo.scanDate || 'N/A'}`,
        `Modality: ${patientInfo.modality || 'N/A'}`,
    ];
    info.forEach(line => addWrappedText(line));
    yPos += 5;

    // Clinical History
    addSectionTitle('Clinical History');
    addWrappedText(patientInfo.clinicalHistory || 'Not Provided', { isItalic: true });
    yPos += 5;

    // Images
    const imageUrisToProcess = (imageDataUris || []).filter(uri => uri.startsWith('data:image'));
    if (imageUrisToProcess.length > 0) {
      addSectionTitle('Key Images');
      for (const [index, uri] of imageUrisToProcess.entries()) {
        const explanationImageUri = explanations[uri]?.explanation?.explanationImage;
        const imgHeight = 60; 
        const imgWidth = 80;
        const combinedHeight = imgHeight + 15;
        checkPageBreak(combinedHeight);
        
        const originalX = margin;
        const explanationX = margin + imgWidth + 10;

        addWrappedText(`Original Scan (File ${index + 1})`, {isBold: true});
        yPos += 2;

        const startY = yPos;
        pdf.addImage(uri, 'PNG', originalX, startY, imgWidth, imgHeight);

        if (explanationImageUri) {
          pdf.text(`AI Explanation`, explanationX, startY - 2);
          pdf.addImage(explanationImageUri, 'PNG', explanationX, startY, imgWidth, imgHeight);
        }
        yPos += imgHeight + 10;
      }
    }
    
    // Detailed Report from Markdown
    const reportLines = detailedReportMarkdown.split('\n');
    let reportStarted = false;

    reportLines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith('## 📌 **Findings Summary')) {
        reportStarted = true;
      }

      if (!reportStarted || line.includes('Patient Information') || line.includes('Clinical History')) {
        return; // Skip until we get to the findings summary
      }

      if (line.startsWith('## ')) {
          addSectionTitle(line.substring(3).replace(/📌|🔍|⚠️/g, '').replace(/\*\*/g, '').trim());
      } else if (line.startsWith('### ')) {
          checkPageBreak(12);
          yPos += 4;
          addWrappedText(line.substring(4).replace(/🫁|❤️|🌬️|🦴/g, '').replace(/\*\*/g, '').trim(), { isBold: true, fontSize: 12, isHeading: true });
          yPos += 2;
      } else if (line.startsWith('*   **')) {
          const match = line.match(/\*\s+\*\*(.*?):\*\*\s*(.*)/);
          if (match) {
              const key = match[1].trim();
              let value = match[2].trim().replace(/\*\*/g, '');
              if (value.startsWith('[') && value.endsWith(']')) {
                  value = value.substring(1, value.length - 1);
              }
              addWrappedText(`${key}: ${value}`, { indent: 5 });
          }
      } else if (line.startsWith('* ')) {
          addWrappedText(line.substring(2), { isListItem: true, indent: 5 });
      } else if (line.startsWith('> ')) {
          addWrappedText(line.substring(2), { isItalic: true, indent: 5 });
      } else if (line !== '---' && !line.startsWith('#')) {
          addWrappedText(line);
      }
    });

    const filename = getPdfFilename(detailedReportMarkdown, patientInfo.patientName);
    pdf.save(filename);
  };


  const handleGenerateAndDownload = async () => {
    if (!imageDataUris || imageDataUris.length === 0 || !analysisResult) return;
    setIsGenerating(true);
    
    const input: GenerateDetailedReportInput = {
      imageDataUri: imageDataUris[0], 
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
        <CardDescription>Initial AI-generated analysis based on the image series.</CardDescription>
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
                This information will be used to generate the final diagnostic PDF report. All fields are optional but recommended.
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
              <Button onClick={handleGenerateAndDownload} disabled={isGenerating}>
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
