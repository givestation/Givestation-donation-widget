import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Project } from '../types';

const QRPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectData = params.get('project');
    
    if (projectData && canvasRef.current) {
      try {
        const project: Project = JSON.parse(decodeURIComponent(projectData));
        const donateUrl = `${window.location.origin}/donate?project=${encodeURIComponent(JSON.stringify(project))}`;
        
        QRCode.toCanvas(canvasRef.current, donateUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default QRPage;