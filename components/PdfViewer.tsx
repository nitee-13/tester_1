import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

 // Import the worker directly

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type PdfViewerProps = {
  url: string;
  onClose?: () => void;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ url, onClose }) => {
  // Create the default layout plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="w-full h-full relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ✕
        </button>
      )}
      
      <div className="h-full">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
          />
        </Worker>
      </div>
    </div>
  );
};

export default PdfViewer;