
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
import { generateBasicReportAction } from '@/app/actions';
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
  const [isDownloading, setIsDownloading] = useState(false);
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

  const handleDownloadPdf = async (reportMarkdown: string) => {
    setIsDownloading(true);
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
        const boldRegex = /\*\*(.*?)\*\*/g;
        let parts = [];
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(processedText)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ text: processedText.substring(lastIndex, match.index), bold: isBold });
            }
            parts.push({ text: match[1], bold: true });
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < processedText.length) {
            parts.push({ text: processedText.substring(lastIndex), bold: isBold });
        }
        
        const originalFontSize = pdf.getFontSize();
        pdf.setFontSize(fontSize);

        parts.forEach(part => {
             const fontStyle = part.bold && isItalic ? 'bolditalic' : part.bold ? 'bold' : isItalic ? 'italic' : 'normal';
             pdf.setFont('helvetica', fontStyle);
             const lines = pdf.splitTextToSize(part.text, contentWidth - indent - (isListItem ? 5 : 0) - pdf.getStringUnitWidth(parts.map(p=>p.text).join('')) * fontSize);
             lines.forEach((line: string) => {
                checkPageBreak(fontSize * 0.35); 
                pdf.text(line, margin + indent, yPos);
             });
        });
        
        const textHeight = (pdf.getTextDimensions(processedText, {fontSize: fontSize, maxWidth: contentWidth - indent}).h);
        yPos += textHeight + 2;

        pdf.setFontSize(originalFontSize);
    };

    const addSectionTitle = (title: string) => {
      checkPageBreak(20);
      yPos += 5; 
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(title, margin, yPos);
      yPos += 5;
      pdf.setDrawColor(220, 220, 220); 
      pdf.line(margin, yPos, pdfWidth - margin, yPos);
      yPos += 8;
    };

    // --- START BUILDING PDF ---
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(33, 150, 243); 
    pdf.text('RadioAgent Diagnostic Report', pdfWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Patient Info
    addSectionTitle('Patient Information');
    const infoTable = [
        [{text:'Patient Name:', bold:true}, {text: patientInfo.patientName || 'N/A'}],
        [{text:'Patient ID:', bold:true}, {text: patientInfo.patientId || 'N/A'}],
        [{text:'Date of Birth:', bold:true}, {text: patientInfo.dateOfBirth || 'N/A'}],
        [{text:'Gender:', bold:true}, {text: patientInfo.gender || 'N/A'}],
        [{text:'Referring Physician:', bold:true}, {text: patientInfo.referringPhysician || 'N/A'}],
        [{text:'Hospital / Unit:', bold:true}, {text: patientInfo.hospital || 'N/A'}],
        [{text:'Scan Date:', bold:true}, {text: patientInfo.scanDate || 'N/A'}],
        [{text:'Modality:', bold:true}, {text: patientInfo.modality || 'N/A'}],
    ];
    
    // Simple two-column layout for patient info
    infoTable.forEach(row => {
        checkPageBreak(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(row[0].text, margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(row[1].text, margin + 50, yPos);
        yPos += 7;
    })
    yPos += 5;

    addSectionTitle('Clinical History');
    addWrappedText(patientInfo.clinicalHistory || 'Not Provided', { isItalic: true });
    yPos += 5;

    const imageUrisToProcess = (imageDataUris || []).filter(uri => uri.startsWith('data:image'));
    if (imageUrisToProcess.length > 0) {
      addSectionTitle('Key Images');
      for (const [index, uri] of imageUrisToProcess.entries()) {
        const explanationImageUri = explanations[uri]?.explanation?.explanationImage;
        const imgHeight = 60; 
        const imgWidth = 80;
        const combinedHeight = imgHeight + 15;
        checkPageBreak(combinedHeight + 10);
        
        addWrappedText(`File ${index + 1}`, {isBold: true, fontSize: 12});

        const startY = yPos;
        pdf.text(`Original Scan`, margin, startY);
        pdf.addImage(uri, 'PNG', margin, startY + 2, imgWidth, imgHeight);

        if (explanationImageUri) {
          pdf.text(`AI Explanation`, margin + imgWidth + 10, startY);
          pdf.addImage(explanationImageUri, 'PNG', margin + imgWidth + 10, startY + 2, imgWidth, imgHeight);
        }
        yPos += imgHeight + 15;
      }
    }
    
    // Detailed Report from Markdown
    const reportLines = reportMarkdown.split('\n');
    let reportStarted = false;

    for(const line of reportLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('## 📌 **Findings Summary')) {
        reportStarted = true;
      }
      
      if (!reportStarted) continue;
      
      // Skip sections already manually added
      if (trimmedLine.toLowerCase().includes('patient information') || trimmedLine.toLowerCase().includes('clinical history')) {
          // Find the next '---' to skip the whole section
          let i = reportLines.indexOf(line);
          while(i < reportLines.length && !reportLines[i].startsWith('---')) {
              i++;
          }
          continue; // effectively skipping this line. This logic is a bit weak. A better way is needed.
      }


      if (trimmedLine.startsWith('## ')) {
          addSectionTitle(trimmedLine.substring(3).replace(/📌|🔍|⚠️/g, '').replace(/\*\*/g, '').trim());
      } else if (trimmedLine.startsWith('### ')) {
          checkPageBreak(12);
          yPos += 4;
          addWrappedText(trimmedLine.substring(4).replace(/🫁|❤️|🌬️|🦴/g, '').replace(/\*\*/g, '').trim(), { isBold: true, fontSize: 12, isHeading: true });
          yPos += 2;
      } else if (trimmedLine.startsWith('*   **')) {
          const match = trimmedLine.match(/\*\s+\*\*(.*?):\*\*\s*(.*)/);
          if (match) {
              const key = match[1].trim();
              let value = match[2].trim().replace(/\*\*/g, '');
              if (value.startsWith('[') && value.endsWith(']')) {
                  value = value.substring(1, value.length - 1);
              }
              // Render key-value pair
              checkPageBreak(10);
              pdf.setFont('helvetica', 'bold');
              pdf.text(`${key}:`, margin + 5, yPos);
              pdf.setFont('helvetica', 'normal');
              const valueLines = pdf.splitTextToSize(value, contentWidth - 45); // 5 for indent, 40 for key
              pdf.text(valueLines, margin + 40, yPos);
              yPos += (valueLines.length * 5) + 2;
          }
      } else if (trimmedLine.startsWith('* ')) {
           checkPageBreak(10);
           pdf.text('•', margin + 5, yPos);
           const textWithoutBullet = trimmedLine.substring(2);
           const textLines = pdf.splitTextToSize(textWithoutBullet, contentWidth - 15);
           pdf.text(textLines, margin + 10, yPos);
           yPos += (textLines.length * 5) + 2;

      } else if (trimmedLine.startsWith('> ')) {
          addWrappedText(trimmedLine.substring(2), { isItalic: true, indent: 5 });
      } else if (trimmedLine !== '---' && !trimmedLine.startsWith('#')) {
          addWrappedText(trimmedLine);
      }
    };

    const filename = getPdfFilename(reportMarkdown, patientInfo.patientName);
    pdf.save(filename);
    setIsDownloading(false);
  };

  const handleGenerateAndDownload = async () => {
    if (!basicReport) return;
    
    setIsDialogOpen(false); 
    toast({
        title: "Generating PDF...",
        description: "Your report is being prepared for download.",
    });
    await handleDownloadPdf(basicReport);
  };

  const isActionDisabled = isLoading || isGenerating || !analysisResult || !basicReport || isDownloading;

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
            <Button className="w-full" disabled={isActionDisabled}>
               {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
               Download Report (PDF)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enter Patient Information for Report</DialogTitle>
              <DialogDescription>
                This information will be added to the PDF report. All fields are optional but recommended.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <h3 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="patientName">Patient Name</Label><Input id="patientName" value={patientInfo.patientName} onChange={handleInputChange} placeholder="John Doe" disabled={isDownloading} /></div>
                <div><Label htmlFor="patientId">Patient ID</Label><Input id="patientId" value={patientInfo.patientId} onChange={handleInputChange} placeholder="PID-12345" disabled={isDownloading} /></div>
                <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" value={patientInfo.dateOfBirth} onChange={handleInputChange} disabled={isDownloading} /></div>
                <div><Label htmlFor="gender">Gender</Label><Input id="gender" value={patientInfo.gender} onChange={handleInputChange} placeholder="Male" disabled={isDownloading} /></div>
                <div><Label htmlFor="referringPhysician">Referring Physician</Label><Input id="referringPhysician" value={patientInfo.referringPhysician} onChange={handleInputChange} placeholder="Dr. Smith" disabled={isDownloading} /></div>
                <div><Label htmlFor="hospital">Hospital / Unit</Label><Input id="hospital" value={patientInfo.hospital} onChange={handleInputChange} placeholder="City General Hospital" disabled={isDownloading} /></div>
                <div><Label htmlFor="scanDate">Scan Date</Label><Input id="scanDate" type="date" value={patientInfo.scanDate} onChange={handleInputChange} disabled={isDownloading} /></div>
                <div><Label htmlFor="modality">Modality</Label><Input id="modality" value={patientInfo.modality} onChange={handleInputChange} placeholder="e.g., Chest X-Ray" disabled={isDownloading} /></div>
              </div>

              <h3 className="font-semibold text-lg flex items-center gap-2 pt-4"><StethoscopeIcon className="w-5 h-5 text-primary" /> Clinical Details</h3>
              <div>
                <Label htmlFor="clinicalHistory">Clinical History</Label>
                <Textarea id="clinicalHistory" placeholder="e.g., 45-year-old male, non-smoker, history of pneumonia..." value={patientInfo.clinicalHistory} onChange={handleInputChange} className="mt-2" rows={3} disabled={isDownloading} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isDownloading}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleGenerateAndDownload} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate & Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
