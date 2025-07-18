import React, { useRef, useState, useEffect } from 'react';

interface CameraCaptureCardProps {
  onAnalyze: (dataUris: string[]) => void;
  isAnalyzing: boolean;
  onClear: () => void;
}

export const CameraCaptureCard: React.FC<CameraCaptureCardProps> = ({ onAnalyze, isAnalyzing, onClear }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!capturedImage) {
      // Start camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          setError('Unable to access camera.');
        });
    }
    return () => {
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        // Stop camera after capture
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
  };

  const handleAnalyze = () => {
    if (capturedImage) {
      onAnalyze([capturedImage]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Capture Image from Camera</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-xs rounded mb-4 border"
            style={{ aspectRatio: '4/3', background: '#000' }}
          />
          <button
            onClick={handleCapture}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-2"
            disabled={!!error}
          >
            Click Image
          </button>
          <button
            onClick={onClear}
            className="ml-2 text-gray-500 underline text-sm"
            type="button"
          >
            Clear
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      ) : (
        <>
          <img src={capturedImage} alt="Captured" className="w-full max-w-xs rounded mb-4 border" />
          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
            <button
              onClick={handleRetake}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              disabled={isAnalyzing}
            >
              Retake
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 