import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface ColorSelectionPageProps {
  onColorSelected: () => void;
}

interface ColorOption {
  name: string;
  hex: string;
  description: string;
}

export function ColorSelectionPage({ onColorSelected }: ColorSelectionPageProps) {
  const { setSelectedColor } = useTheme();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const colors: ColorOption[] = [
    {
      name: "Pastel Pink",
      hex: "#FFB6C1",
      description: "Represents tenderness, romance, and innocence."
    },
    {
      name: "Baby Blue",
      hex: "#87CEEB",
      description: "Symbolizes calm, tranquility, and purity."
    },
    {
      name: "Khaki",
      hex: "#F0E68C",
      description: "Earthy and grounding, promotes balance and stability."
    },
    {
      name: "Emerald",
      hex: "#50C878",
      description: "Rich and vibrant, symbolizes growth and renewal."
    },
    {
      name: "Amber",
      hex: "#FFBF00",
      description: "Warm and energizing, perfect for those who love yellow."
    },
    {
      name: "Lilac",
      hex: "#C8A2C8",
      description: "A pale shade of violet, it represents a dreamlike and delicate quality."
    },
    {
      name: "Soft Coral",
      hex: "#F08080",
      description: "A gentle, warm, and approachable pastel hue."
    },
    {
      name: "Dark Blue",
      hex: "#191970",
      description: "Deep and contemplative, inspires focus and wisdom."
    }
  ];

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color.hex);
    onColorSelected();
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl mb-3 sm:mb-4">Choose Your Theme Color</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Select a color that resonates with your mood and personality
          </p>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 sm:space-y-4"
            >
              <button
                onClick={() => handleColorSelect(color)}
                onMouseEnter={() => setHoveredColor(color.hex)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-200 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
                  hoveredColor === color.hex ? 'translate-y-[-8px]' : ''
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-center">
                <h3 className="text-xs sm:text-sm mb-1">{color.name}</h3>
                <p className="text-xs text-gray-600 max-w-[120px] sm:max-w-[150px] leading-relaxed">
                  {color.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}