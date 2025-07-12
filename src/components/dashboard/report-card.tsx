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

// Function to convert Markdown to styled HTML for the PDF
const markdownToHtml = (markdown: string) => {
  let html = markdown
    // Headings
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 16px; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 18px; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 22px; font-weight: 700; margin-bottom: 1em;">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // List items
    .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 0.5em;">$1</li>')
    // HR
    .replace(/---/g, '<hr style="border: none; border-top: 1px solid #ccc; margin: 1.5em 0;" />')
    // Blockquotes (for disclaimer)
    .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 0; font-style: italic;">$1</blockquote>')
    // Convert newlines to breaks
    .replace(/\n/g, '<br />');

  // Wrap lists
  html = html.replace(/<li/g, '<ul><li').replace(/<\/li><br \/><ul>/g, '</li></ul><br /><ul>');
  html = html.replace(/<li(.*?)/g, '<ul><li$1');
  const listEndRegex = /(<\/li>)<br \/>(?!<li)/g;
  html = html.replace(listEndRegex, '$1</ul>');

  // Cleanup redundant list tags
  html = html.replace(/<\/ul><br \/><ul>/g, '');
  
  return html;
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
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const originalImageUri = imageDataUris?.[0]; // For now, we take the first image for the report
    const explanationImageUri = originalImageUri ? explanations[originalImageUri]?.explanation?.explanationImage : null;

    const reportElement = document.createElement('div');
    reportElement.style.width = '800px';
    reportElement.style.padding = '20px';
    reportElement.style.fontFamily = 'Arial, sans-serif';
    reportElement.style.color = '#333';
    reportElement.style.background = '#fff';

    const patientInfoHtml = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Patient Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr><td style="padding: 4px; font-weight: bold;">Patient Name:</td><td style="padding: 4px;">${patientInfo.patientName}</td><td style="padding: 4px; font-weight: bold;">Hospital / Unit:</td><td style="padding: 4px;">${patientInfo.hospital}</td></tr>
            <tr><td style="padding: 4px; font-weight: bold;">Patient ID:</td><td style="padding: 4px;">${patientInfo.patientId}</td><td style="padding: 4px; font-weight: bold;">Scan Date:</td><td style="padding: 4px;">${patientInfo.scanDate}</td></tr>
            <tr><td style="padding: 4px; font-weight: bold;">Date of Birth:</td><td style="padding: 4px;">${patientInfo.dateOfBirth}</td><td style="padding: 4px; font-weight: bold;">Modality:</td><td style="padding: 4px;">${patientInfo.modality}</td></tr>
            <tr><td style="padding: 4px; font-weight: bold;">Gender:</td><td style="padding: 4px;">${patientInfo.gender}</td><td style="padding: 4px; font-weight: bold;">Referring Physician:</td><td style="padding: 4px;">${patientInfo.referringPhysician}</td></tr>
          </tbody>
        </table>
      </div>
       <div style="margin-bottom: 20px;">
         <h2 style="font-size: 18px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Clinical History</h2>
         <p>${patientInfo.clinicalHistory || 'Not Provided'}</p>
       </div>
    `;

    const imageSectionHtml = `
      <div style="margin-bottom: 20px; text-align: center;">
        <h2 style="font-size: 18px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Key Images</h2>
        <div style="display: flex; justify-content: space-around; align-items: flex-start; gap: 20px;">
          ${originalImageUri ? `
            <div style="width: 45%;">
              <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Original Scan</h3>
              <img src="${originalImageUri}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;" />
            </div>
          ` : ''}
          ${explanationImageUri ? `
            <div style="width: 45%;">
              <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">AI Explanation (Heatmap)</h3>
              <img src="${explanationImageUri}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;" />
            </div>
          ` : ''}
        </div>
        ${!originalImageUri && !explanationImageUri ? '<p>No images available for this report.</p>' : ''}
      </div>
    `;

    const styledReportHtml = markdownToHtml(detailedReportMarkdown);
    reportElement.innerHTML = `
      <h1 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 20px; color: #6699CC;">RadioAgent Diagnostic Report</h1>
      ${patientInfoHtml}
      ${imageSectionHtml}
      <hr style="border: none; border-top: 1px solid #ccc; margin: 1.5em 0;" />
      ${styledReportHtml}
    `;
    
    document.body.appendChild(reportElement);

    try {
        const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        const pageMargin = 10;
        const effectivePdfWidth = pdfWidth - (pageMargin * 2);
        const effectivePdfHeight = pdfHeight - (pageMargin * 2);

        // Add first page
        pdf.addImage(imgData, 'PNG', pageMargin, pageMargin, effectivePdfWidth, imgHeight * (effectivePdfWidth / imgProps.width));
        heightLeft -= effectivePdfHeight;
        
        // Add subsequent pages if content overflows
        while (heightLeft > 0) {
            position -= effectivePdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', pageMargin, position + pageMargin, effectivePdfWidth, imgHeight * (effectivePdfWidth / imgProps.width));
            heightLeft -= effectivePdfHeight;
        }

        pdf.save('RadioAgent_Detailed_Report.pdf');
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({
            variant: 'destructive',
            title: 'PDF Generation Failed',
            description: 'There was an error creating the PDF file.',
        });
    } finally {
        document.body.removeChild(reportElement);
    }
  };

  const handleGenerateAndDownload = async () => {
    if (!imageDataUris || imageDataUris.length === 0 || !analysisResult) return;
    setIsGenerating(true);
    
    const input: GenerateDetailedReportInput = {
      imageDataUri: imageDataUris[0], // Pass first image for main report context
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
