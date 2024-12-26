declare module '@react-pdf-viewer/core' {
  export interface ViewerProps {
    fileUrl: string;
    plugins?: any[];
    defaultScale?: number;
  }
  
  export const Viewer: React.FC<ViewerProps>;
  export const Worker: React.FC<{
    workerUrl: string;
    children: React.ReactNode;
  }>;
}

declare module '@react-pdf-viewer/default-layout' {
  export function defaultLayoutPlugin(): any;
}
