import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface FontSelectionPageProps {
  onFontSelected: () => void;
}

interface FontOption {
  name: string;
  fontFamily: string;
  description: string;
}

export function FontSelectionPage({ onFontSelected }: FontSelectionPageProps) {
  const { selectedColor, setSelectedFont } = useTheme();
  const [hoveredFont, setHoveredFont] = useState<string | null>(null);

  const fonts: FontOption[] = [
    {
      name: "Inter",
      fontFamily: "Inter, sans-serif",
      description: "Modern and clean, perfect for digital reading."
    },
    {
      name: "Poppins",
      fontFamily: "Poppins, sans-serif",
      description: "Friendly and approachable with geometric shapes."
    },
    {
      name: "Roboto",
      fontFamily: "Roboto, sans-serif",
      description: "Google's signature font, optimized for readability."
    },
    {
      name: "Open Sans",
      fontFamily: "Open Sans, sans-serif",
      description: "Humanist design that's warm and welcoming."
    },
    {
      name: "Dancing Script",
      fontFamily: "Dancing Script, cursive",
      description: "Elegant cursive script with natural flow."
    },
    {
      name: "Pacifico",
      fontFamily: "Pacifico, cursive",
      description: "Playful and friendly handwritten style."
    },
    {
      name: "Cinzel",
      fontFamily: "Cinzel, serif",
      description: "Classical and elegant, inspired by Roman inscriptions."
    },
    {
      name: "Playfair Display",
      fontFamily: "Playfair Display, serif",
      description: "High contrast and distinctive for elegant designs."
    }
  ];

  const handleFontSelect = (font: FontOption) => {
    setSelectedFont(font.fontFamily);
    onFontSelected();
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl mb-3 sm:mb-4">Choose Your Font Style</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Select a typography that feels comfortable and matches your preference
          </p>
        </div>

        {/* Font Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {fonts.map((font, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 sm:space-y-4"
            >
              <button
                onClick={() => handleFontSelect(font)}
                onMouseEnter={() => setHoveredFont(font.fontFamily)}
                onMouseLeave={() => setHoveredFont(null)}
                className={`w-full h-16 sm:h-20 border-2 border-gray-200 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                  hoveredFont === font.fontFamily ? 'translate-y-[-4px]' : ''
                }`}
                style={{ 
                  borderColor: hoveredFont === font.fontFamily ? selectedColor : '#e5e7eb',
                  fontFamily: font.fontFamily 
                }}
              >
                <span className="text-base sm:text-lg">{font.name}</span>
              </button>
              <div className="text-center px-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {font.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}