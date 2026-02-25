"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

// Define context type
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (value: boolean, className?: string, activeTitle?: boolean) => void;
  className?: string;
  activeTitle?: boolean;
}

// Create context with a default value
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Context Provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [className, setClassName] = useState<string | undefined>(undefined);
  const [activeTitle, setActiveTitle] = useState<boolean | undefined>(undefined);

  const setLoading = (value: boolean, newClassName?: string, newActiveTitle?: boolean) => {
    setIsLoading(value);
    setClassName(newClassName);
    setActiveTitle(newActiveTitle);

    // Optional: reset className saat loading dimatikan
    if (!value) {
      setClassName(undefined);
      setActiveTitle(undefined);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, className, activeTitle }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};