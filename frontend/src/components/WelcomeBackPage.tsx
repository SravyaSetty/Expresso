import { Button } from "./ui/button";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface WelcomeBackPageProps {
  userName: string;
  // --- CHANGE 3: Update the onContinue prop to pass the mood string ---
  onContinue: (mood: string) => void;
}

export function WelcomeBackPage({ userName, onContinue }: WelcomeBackPageProps) {
  const { selectedColor } = useTheme();
  const [mood, setMood] = useState("");

  const moods = [
    { emoji: "😊", label: "Great" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😕", label: "Not great" },
    { emoji: "😔", label: "Rough" }
  ];

  const handleContinue = () => {
    // Pass the selected mood back to the App component
    onContinue(mood);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="flex min-h-screen">
        <div className="w-1/5"></div>
        <div className="w-3/5 flex flex-col justify-center py-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl">Hi {userName}!</h1>
              <p className="text-xl text-gray-600">How did your day go?</p>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700">Let me know how you're feeling:</p>
              <div className="flex justify-center space-x-4">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.label}
                    onClick={() => setMood(moodOption.label)}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all hover:scale-105 ${
                      mood === moodOption.label ? 'shadow-lg scale-105' : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: mood === moodOption.label ? selectedColor + '20' : '#f9f9f9',
                      border: mood === moodOption.label ? `2px solid ${selectedColor}` : '2px solid transparent'
                    }}
                  >
                    <span className="text-4xl mb-2">{moodOption.emoji}</span>
                    <span className="text-sm text-gray-600">{moodOption.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-8">
              <Button
                onClick={handleContinue}
                disabled={!mood}
                className="text-white px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: mood ? selectedColor : '#d1d5db' }}
              >
                Continue to Chat
              </Button>
            </div>
            {/* Allow skipping, which passes an empty mood string */}
            <button onClick={() => onContinue("")} className="text-gray-500 hover:text-gray-700 text-sm underline">
              Skip for now
            </button>
          </div>
        </div>
        <div className="w-1/5"></div>
      </main>
    </div>
  );
}