"use client"
import React, { createContext, useContext, useState } from "react";

type Source = {
  id: string;
  name: string;
  uploadTime: Date;
  url: string;
};

interface SourceContextType {
  sources: Source[];
  addSources: (newSources: Source[]) => void;
  selectedSource: Source | null;
  setSelectedSource: (source: Source | null) => void;
}

type SourcesContextType = {
  sources: Source[];
  addSources: (newSources: Source[]) => void;
  selectedSource: Source | null;
  setSelectedSource: (source: Source | null) => void;
};

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export const SourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const addSources = (newSources: Source[]) => {
    setSources((prev) => [...prev, ...newSources]);
  };

  return (
    <SourcesContext.Provider value={{ sources, addSources, selectedSource, setSelectedSource }}>
      {children}
    </SourcesContext.Provider>
  );
};

export const useSources = (): SourcesContextType => {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error('useSources must be used within a SourcesProvider');
  }
  return context;
}; 