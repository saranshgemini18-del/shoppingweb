
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Camera, Loader2 } from 'lucide-react';
import { visualSearch } from '@/ai/flows/visual-search-flow';

type VisualSearchProps = {
  onSearchResult: (result: string) => void;
};

export function VisualSearch({ onSearchResult }: VisualSearchProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
         setHasCameraPermission(false);
         console.error("Camera not supported on this browser.");
         toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use visual search.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop video streams when component unmounts
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleCaptureAndSearch = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if(context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');

        try {
            const result = await visualSearch({ photoDataUri: dataUri });
            onSearchResult(result.searchTerm);
             toast({
                title: 'Visual Search Complete',
                description: `Now showing results for "${result.searchTerm}".`,
            });
        } catch (error) {
            console.error('Visual search failed:', error);
            toast({
                variant: 'destructive',
                title: 'Search Failed',
                description: 'Could not identify a product from the image.',
            });
        }
    }
    
    setIsProcessing(false);
  };
  
  if (hasCameraPermission === null) {
      return (
          <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2">Accessing camera...</p>
          </div>
      );
  }

  return (
    <div className="grid gap-4">
      <div className="relative w-full aspect-video rounded-md border bg-muted overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        {!hasCameraPermission && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
             <Alert variant="destructive" className="w-auto max-w-sm">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
          </div>
        )}
      </div>
      <Button onClick={handleCaptureAndSearch} disabled={!hasCameraPermission || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          'Search with Image'
        )}
      </Button>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
