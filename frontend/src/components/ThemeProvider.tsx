import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ThemeContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [selectedColor, setSelectedColor] = useState<string>('#000000'); // Default black
  const [selectedFont, setSelectedFont] = useState<string>('Inter'); // Default font

  return (
    <ThemeContext.Provider value={{ selectedColor, setSelectedColor, selectedFont, setSelectedFont }}>
      <div style={{ fontFamily: selectedFont }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}