import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";

interface PlaceholderPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  title: string;
  currentPage: string;
}

export function PlaceholderPage({ onBack, onNavigate, title, currentPage }: PlaceholderPageProps) {
  const { selectedColor } = useTheme();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
            style={{ backgroundColor: selectedColor }}
          >
            <span className="text-white text-sm">M</span>
          </div>
          <span className="text-sm">{title}</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage={currentPage} />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="text-center space-y-6">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedColor + '20' }}
          >
            <div 
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: selectedColor }}
            ></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl">{title}</h1>
            <p className="text-gray-600 max-w-md">
              This feature is coming soon! We're working hard to bring you an amazing {title.toLowerCase()} experience.
            </p>
          </div>
          <Button
            onClick={onBack}
            className="text-white px-6 py-2"
            style={{ backgroundColor: selectedColor }}
          >
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
}