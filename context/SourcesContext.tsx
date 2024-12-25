"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

  // Log when the provider mounts
  useEffect(() => {
    console.log("[SourcesProvider] Mounted");
    console.log("[SourcesProvider] Initial sources:", sources);
  }, []);

  const addSources = (newSources: Source[]) => {
    console.log("[SourcesContext] addSources called with:", newSources);
    setSources((prevSources) => {
      const updatedSources = [...prevSources, ...newSources];
      console.log("[SourcesContext] Updated sources:", updatedSources);
      return updatedSources;
    });
  };

  // Log whenever sources change
  useEffect(() => {
    console.log("[SourcesContext] Sources updated:", sources);
  }, [sources]);

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