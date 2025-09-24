import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  text: string;
}

export const QRCodeCanvas: React.FC<QRCodeCanvasProps> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, {
          width: 160,
          margin: 1,
          color: {
              dark: '#e2e8f0', // slate-200
              light: '#0f172a'  // slate-900
          }
      }, (error: Error | null) => {
        if (error) console.error(error);
      });
    }
  }, [text]);

  return <canvas ref={canvasRef} />;
};
