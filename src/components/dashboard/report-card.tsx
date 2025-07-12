
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

// Function to extract a filename from the report
const getPdfFilename = (markdown: string, patientName?: string): string => {
    // Try to find the first major finding as the title
    const findingMatch = markdown.match(/^\*   \*\*Finding:\*\* \[([^\]]+)\]/m);
    if (findingMatch && findingMatch[1]) {
        const title = findingMatch[1].replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
        return `RadioAgent_Report_${title}.pdf`;
    }

    // Fallback to patient name
    if (patientName && patientName.trim() !== '') {
        const safePatientName = patientName.replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
        return `RadioAgent_Report_${safePatientName}.pdf`;
    }

    // Generic fallback
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
    const { default: jsPDF } = await import('jspdf');

    const imageUrisToProcess = (imageDataUris || []).filter(uri => uri.startsWith('data:image'));

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;

    // Create a hidden element to render HTML for PDF conversion
    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.width = `${(pdfWidth - margin * 2) * 4}px`; // Approx width in pixels
    reportElement.style.fontFamily = 'Arial, sans-serif';
    reportElement.style.color = '#333';
    reportElement.style.background = '#fff';
    reportElement.style.fontSize = '12px'; // Base font size
    document.body.appendChild(reportElement);

    try {
        // --- CONSTRUCT ONE BIG HTML STRING ---

        // Patient Info HTML
        const patientInfoHtml = `
            <div style="padding: 0 ${margin}px;">
                <h2 style="font-size: 16px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Patient Information</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tbody>
                        <tr><td style="padding: 4px 8px; font-weight: bold; width: 15%;">Patient Name:</td><td style="padding: 4px 8px; width: 35%;">${patientInfo.patientName || 'N/A'}</td><td style="padding: 4px 8px; font-weight: bold; width: 15%;">Hospital / Unit:</td><td style="padding: 4px 8px; width: 35%;">${patientInfo.hospital || 'N/A'}</td></tr>
                        <tr><td style="padding: 4px 8px; font-weight: bold;">Patient ID:</td><td style="padding: 4px 8px;">${patientInfo.patientId || 'N/A'}</td><td style="padding: 4px 8px; font-weight: bold;">Scan Date:</td><td style="padding: 4px 8px;">${patientInfo.scanDate || 'N/A'}</td></tr>
                        <tr><td style="padding: 4px 8px; font-weight: bold;">Date of Birth:</td><td style="padding: 4px 8px;">${patientInfo.dateOfBirth || 'N/A'}</td><td style="padding: 4px 8px; font-weight: bold;">Modality:</td><td style="padding: 4px 8px;">${patientInfo.modality || 'N/A'}</td></tr>
                        <tr><td style="padding: 4px 8px; font-weight: bold;">Gender:</td><td style="padding: 4px 8px;">${patientInfo.gender || 'N/A'}</td><td style="padding: 4px 8px; font-weight: bold;">Referring Physician:</td><td style="padding: 4px 8px;">${patientInfo.referringPhysician || 'N/A'}</td></tr>
                    </tbody>
                </table>
                <h2 style="font-size: 16px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; margin-top: 15px;">Clinical History</h2>
                <p style="font-size: 12px; padding: 4px 8px; white-space: pre-wrap;">${patientInfo.clinicalHistory || 'Not Provided'}</p>
            </div>
        `;

        // Images HTML
        let imagesHtml = '';
        if (imageUrisToProcess.length > 0) {
            imagesHtml += `<div style="padding: 0 ${margin}px; margin-top: 15px; page-break-before: always;"><h2 style="font-size: 16px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Key Images</h2></div>`;
            
            for (const [index, uri] of imageUrisToProcess.entries()) {
                const explanationImageUri = explanations[uri]?.explanation?.explanationImage;
                imagesHtml += `
                    <div style="padding: 0 ${margin}px; margin-bottom: 25px; page-break-inside: avoid;">
                        <div style="display: flex; justify-content: space-around; align-items: flex-start; gap: 20px; text-align: center;">
                            <div style="width: 48%;">
                                <h3 style="font-size: 12px; font-weight: 600; margin-bottom: 10px;">Original Scan (File ${index + 1})</h3>
                                <img src="${uri}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;" />
                            </div>
                            ${explanationImageUri ? `
                                <div style="width: 48%;">
                                    <h3 style="font-size: 12px; font-weight: 600; margin-bottom: 10px;">AI Explanation</h3>
                                    <img src="${explanationImageUri}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px;" />
                                </div>
                            ` : `
                                <div style="width: 48%; display: flex; align-items: center; justify-content: center; border: 1px dashed #ccc; border-radius: 4px; min-height: 150px;">
                                    <p style="color: #888; font-size: 11px;">No AI explanation generated.</p>
                                </div>
                            `}
                        </div>
                    </div>
                `;
            }
        }
        
        // Report Markdown to HTML
        const markdownHtml = detailedReportMarkdown
            .replace(/^# (.*$)/gim, '') // Remove main H1 as we have a PDF header
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 16px; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; page-break-before: auto; page-break-inside: avoid;">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 14px; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; page-break-after: avoid;">$1</h3>')
            .replace(/^\*   \*\*(.*?):\*\* (.*$)/gim, '<p style="margin-left: 10px; margin-bottom: 0.5em;"><strong>$1:</strong> $2</p>')
            .replace(/^\* (.*$)/gim, '<p style="margin-left: 20px; margin-bottom: 0.5em;">&bull; $1</p>')
            .replace(/---/g, '<hr style="border: none; border-top: 1px solid #ccc; margin: 1.5em 0;" />')
            .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 0; font-style: italic;">$1</blockquote>')
            .replace(/\n/g, '<br />')
            .replace(/<br \/>\s*<br \/>/g, '<br />');

        const reportHtml = `<div style="padding: 0 ${margin}px; page-break-before: always;">${markdownHtml}</div>`;
        
        // --- RENDER THE SINGLE HTML STRING ---
        const fullHtml = `
            <div>
                ${patientInfoHtml}
                ${imagesHtml}
                ${reportHtml}
            </div>
        `;
        
        reportElement.innerHTML = fullHtml;

        // Add a header to each page
        const header = `<div style="padding: 10px; text-align: center; margin-bottom: 10px;">
                          <h1 style="font-size: 20px; font-weight: 700; color: #6699CC; margin: 0;">RadioAgent Diagnostic Report</h1>
                        </div>`;

        await pdf.html(header, {
            x: 0,
            y: 0,
            width: pdfWidth,
            windowWidth: pdfWidth
        });

        await pdf.html(reportElement, {
            x: 0,
            y: 30, // Start content below the header
            width: pdfWidth,
            windowWidth: reportElement.clientWidth,
            autoPaging: 'text',
            margin: [30, margin, 15, margin] // Top, right, bottom, left
        });
        
        const filename = getPdfFilename(detailedReportMarkdown, patientInfo.patientName);
        pdf.save(filename);

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({
            variant: 'destructive',
            title: 'PDF Generation Failed',
            description: 'There was an error creating the PDF file.',
        });
    } finally {
        if (reportElement) {
            document.body.removeChild(reportElement);
        }
    }
  };


  const handleGenerateAndDownload = async () => {
    if (!imageDataUris || imageDataUris.length === 0 || !analysisResult) return;
    setIsGenerating(true);
    
    // In a multi-image scenario, AI analysis is synthesized.
    // We pass the first image for visual context, but the report
    // is based on the combined findings.
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
