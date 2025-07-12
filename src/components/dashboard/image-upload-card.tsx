'use client';

import { useState, useCallback, type DragEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, X, CheckCircle, Loader2, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const MAX_FILES = 30;

interface ImageUploadCardProps {
  onAnalyze: (dataUris: string[]) => void;
  isAnalyzing: boolean;
  onClear: () => void;
}

export function ImageUploadCard({ onAnalyze, isAnalyzing, onClear }: ImageUploadCardProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFiles = (files: FileList | null) => {
    if (isAnalyzing) return;
    if (!files || files.length === 0) return;

    const totalAfterAdd = selectedImages.length + files.length;
    if (totalAfterAdd > MAX_FILES) {
      toast({
        variant: 'destructive',
        title: 'Too many files',
        description: `You can upload a maximum of ${MAX_FILES} images. You have already selected ${selectedImages.length}.`,
      });
      return;
    }
    
    const fileArray = Array.from(files);
    let newPreviews: string[] = [];
    let processedFiles = 0;

    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUri = reader.result as string;
          newPreviews.push(dataUri);
          processedFiles++;

          if (processedFiles === fileArray.length) {
            setSelectedImages(prevImages => [...prevImages, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedFiles++;
         if (processedFiles === fileArray.length) {
            setSelectedImages(prevImages => [...prevImages, ...newPreviews]);
          }
      }
    });
  };
  
  const handleAnalyzeClick = () => {
    if (selectedImages.length > 0) {
      onAnalyze(selectedImages);
    }
  };

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  const handleClear = () => {
    setSelectedImages([]);
    onClear();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upload Medical Images</span>
          {(selectedImages.length > 0) && (
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={isAnalyzing}>
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          )}
        </CardTitle>
        <CardDescription>Select or drag and drop multiple images (up to {MAX_FILES}). The AI will analyze the entire series.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragging ? 'border-primary bg-accent' : 'border-border'
          }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <Input
            id="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/dicom"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={isAnalyzing}
            multiple
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FileUp className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">Supports X-rays, CT scans, MRIs, and ultrasounds</p>
            </div>
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center mb-4">
                 <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5"/>
                    <span>{selectedImages.length} image(s) selected and ready.</span>
                  </div>
            </div>
            <ScrollArea className="h-48 w-full">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pr-4">
                {selectedImages.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image src={src} alt={`Medical scan preview ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="xray scan" />
                  </div>
                ))}
              </div>
            </ScrollArea>
             <Button onClick={handleAnalyzeClick} disabled={isAnalyzing || selectedImages.length === 0} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4"/>
                  Analyze {selectedImages.length} Image(s)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
