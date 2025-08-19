
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { diagnosePlant } from '@/actions/search';
import type { DiagnosePlantOutput } from '@/ai/flows/diagnose-plant';
import { Bug, Upload, Leaf, ShieldCheck, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

function SubmitButton() {
  return (
    <Button type="submit" className="w-full mt-2">
      <Bug className="mr-2 h-4 w-4" />
      Diagnose Plant
    </Button>
  );
}

export function DiseaseDiagnosisCard() {
  const { toast } = useToast();
  const [diagnosis, setDiagnosis] = useState<DiagnosePlantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setDiagnosis(null);
      setError(null);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const photo = formData.get('photo') as File;

    if (!photo || photo.size === 0) {
      toast({
        variant: 'destructive',
        title: 'No Photo Selected',
        description: 'Please select a photo of your plant to diagnose.',
      });
      return;
    }

    setIsDiagnosing(true);
    setError(null);
    setDiagnosis(null);

    try {
      const result = await diagnosePlant(formData);
      setDiagnosis(result);
    } catch (e: any) {
      setError('An error occurred during diagnosis. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: e.message || 'An unknown error occurred.',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="text-primary" />
          Disease Diagnosis
        </CardTitle>
        <CardDescription>AI-powered plant health analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleFormSubmit}>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="button" variant="outline" className="w-full" onClick={triggerFileSelect}>
            <Upload className="mr-2 h-4 w-4" />
            {previewUrl ? 'Change Photo' : 'Upload Photo'}
          </Button>

          {previewUrl && (
            <div className="mt-4 aspect-video w-full overflow-hidden rounded-md border">
              <Image src={previewUrl} alt="Plant preview" width={300} height={200} className="h-full w-full object-cover" />
            </div>
          )}
          
          {previewUrl && !isDiagnosing && <SubmitButton />}
        </form>

        {isDiagnosing && (
          <div className="flex items-center justify-center pt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="ml-4 text-muted-foreground">Diagnosing...</p>
          </div>
        )}
        
        {error && <p className="text-destructive text-sm font-medium">{error}</p>}

        {diagnosis && (
          <div className="pt-4 space-y-3">
             <h4 className="font-semibold flex items-center gap-2">
                {diagnosis.isHealthy ? 
                    <ShieldCheck className="text-green-500"/> : 
                    <ShieldAlert className="text-destructive"/>
                }
                Diagnosis Result
            </h4>
            <div className={`p-3 rounded-md ${diagnosis.isHealthy ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <p><strong>Status:</strong> <span className={diagnosis.isHealthy ? 'text-green-600 font-bold' : 'text-destructive font-bold'}>{diagnosis.isHealthy ? 'Healthy' : 'Diseased'}</span></p>
                {!diagnosis.isHealthy && (
                    <>
                        <p><strong>Disease:</strong> {diagnosis.disease}</p>
                        <p className="mt-2"><strong>Suggested Remedy:</strong> {diagnosis.remedy}</p>
                    </>
                )}
            </div>
          </div>
        )}

        {!previewUrl && !isDiagnosing && (
            <div className="text-center text-sm text-muted-foreground pt-4">
                <Leaf className="mx-auto h-8 w-8 text-gray-300" />
                <p>Upload a photo to begin diagnosis.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
