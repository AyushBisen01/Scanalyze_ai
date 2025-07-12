'use client';

import { useState, useCallback, type DragEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, X, CheckCircle, Loader2 } from 'lucide-react';

interface ImageUploadCardProps {
  onImageUpload: (dataUri: string) => void;
  isAnalyzing: boolean;
  onClear: () => void;
  hasImage: boolean;
}

export function ImageUploadCard({ onImageUpload, isAnalyzing, onClear, hasImage }: ImageUploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        setFileName(file.name);
        onImageUpload(dataUri);
      };
      reader.readAsDataURL(file);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    onClear();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upload Medical Image</span>
          {hasImage && (
            <Button variant="ghost" size="icon" onClick={handleClear} disabled={isAnalyzing}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!preview ? (
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
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              disabled={isAnalyzing}
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
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-md overflow-hidden border">
              <Image src={preview} alt="Medical scan preview" layout="fill" objectFit="cover" data-ai-hint="xray scan" />
            </div>
            <div className="flex-1 flex items-center">
              {isAnalyzing ? (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                    <span>Analyzing {fileName}...</span>
                  </div>
              ) : (
                 <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5"/>
                    <span>{fileName} ready for analysis.</span>
                  </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
