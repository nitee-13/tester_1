"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

type Source = {
  id: string;
  name: string;
  uploadTime: Date;
};

type SourcesContextType = {
  sources: Source[];
  addSources: (newSources: Source[]) => void;
};

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export const SourcesProvider = ({ children }: { children: ReactNode }) => {
  const [sources, setSources] = useState<Source[]>([]);

  const addSources = (newSources: Source[]) => {
    setSources((prevSources) => [...prevSources, ...newSources]);
  };

  return (
    <SourcesContext.Provider value={{ sources, addSources }}>
      {children}
    </SourcesContext.Provider>
  );
};

export const useSources = (): SourcesContextType => {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error("useSources must be used within a SourcesProvider");
  }
  return context;
}; 