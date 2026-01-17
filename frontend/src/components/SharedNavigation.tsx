import { Button } from "./ui/button";
import { Menu, X, Home, Heart, Compass, GamepadIcon, Users, BookOpen, BarChart3, MessageCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface SharedNavigationProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function SharedNavigation({ onNavigate, currentPage }: SharedNavigationProps) {
  const { selectedColor } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wellness', label: 'Wellness Advisor', icon: Heart },
    { id: 'guidance', label: 'Guidance', icon: Compass },
    { id: 'funzone', label: 'Funzone', icon: GamepadIcon },
    { id: 'buzzsession', label: 'Buzzsession', icon: Users },
    { id: 'memoir', label: 'Memoir', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  const handleNavigate = (page: string) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };

  return (
    <>
      {/* Menu Button */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div 
            className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white bg-opacity-90 backdrop-blur-lg border-l border-white border-opacity-30 shadow-2xl flex flex-col"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text-white text-xs sm:text-sm">M</span>
                </div>
                <span className="text-sm">Expresso</span>
              </div>
              <Button
                onClick={() => setIsMenuOpen(false)}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-4">
              <div className="space-y-1 sm:space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm sm:text-base ${
                        currentPage === item.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* About Us and Logout */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => handleNavigate('about')}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg text-sm sm:text-base"
              >
                <span>About Us</span>
              </button>
              <button 
                onClick={() => handleNavigate('home')}
                className="w-full flex items-center px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors rounded-lg text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}