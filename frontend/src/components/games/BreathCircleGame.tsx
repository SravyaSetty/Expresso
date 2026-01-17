import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../ThemeProvider";

interface BreathCircleGameProps {
  onBack: () => void;
}

type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface PhaseConfig {
  duration: number;
  text: string;
  nextPhase: BreathingPhase;
  className: string;
}

const BREATHING_CYCLE: Record<BreathingPhase, PhaseConfig> = {
  inhale: { duration: 4000, text: "Breathe In...", nextPhase: 'holdIn', className: 'animate-inhale' },
  holdIn: { duration: 2000, text: "Hold", nextPhase: 'exhale', className: 'animate-inhale' },
  exhale: { duration: 6000, text: "Breathe Out...", nextPhase: 'holdOut', className: 'animate-exhale' },
  holdOut: { duration: 2000, text: "Hold", nextPhase: 'inhale', className: 'animate-exhale' }
};

export function BreathCircleGame({ onBack }: BreathCircleGameProps) {
  const { selectedColor } = useTheme();
  const [phase, setPhase] = useState<BreathingPhase>('inhale');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(BREATHING_CYCLE[phase].nextPhase);
    }, BREATHING_CYCLE[phase].duration);

    return () => clearTimeout(timer);
  }, [phase]);

  const currentPhase = BREATHING_CYCLE[phase];
  const animationStyle = {
    animationName: phase === 'inhale' || phase === 'holdIn' ? 'inhale-kf' : 'exhale-kf',
    animationDuration: `${currentPhase.duration}ms`,
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  };

  return (
    <>
      {/* Add keyframe animations directly to the document head */}
      <style>{`
        @keyframes inhale-kf {
          from { transform: scale(0.8); }
          to { transform: scale(1.2); }
        }
        @keyframes exhale-kf {
          from { transform: scale(1.2); }
          to { transform: scale(0.8); }
        }
      `}</style>
      <div className="min-h-screen bg-white text-black flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}>
              <span className="text-white text-sm">M</span>
            </div>
            <span className="text-sm">Breath Circle</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer animated circle */}
            <div
              className="absolute w-full h-full rounded-full transition-colors duration-500"
              style={{ 
                ...animationStyle,
                backgroundColor: selectedColor + '30' // e.g., #RRGGBB30 for transparency
              }}
            />
            {/* Inner static circle */}
            <div 
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center text-center"
                style={{ backgroundColor: selectedColor }}
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white">
                {currentPhase.text}
              </h2>
            </div>
          </div>
           <p className="mt-12 text-gray-500 text-center max-w-xs">
            Follow the circle. Breathe in as it grows, and breathe out as it shrinks.
          </p>
        </main>
      </div>
    </>
  );
}