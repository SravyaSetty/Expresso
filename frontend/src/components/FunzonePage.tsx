import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FunzonePageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onPlayGame: (gameId: string) => void;
}

interface Game {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  mood: "😊" | "🧘" | "🤔" | "😌" | "🎯" | "💭";
  image: string;
  description: string;
}
const allGames: Game[] = [
  {
    id: "memory-flip",
    name: "Memory Cards",
    difficulty: "Medium",
    mood: "🤔",
    image: "https://images.unsplash.com/photo-1721333091271-2c488efcdc2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW1vcnklMjBjYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTgwMTAxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Test and improve your memory with fun card matching"
  },
  {
      id: "breath-circle",
      name: "Breath Circle",
      difficulty: "Easy",
      mood: "🧘",
      image: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhdGhpbmclMjBleGVyY2lzZSUyMGdhbWV8ZW58MXx8fHwxNzU4MDEwMjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Practice mindful breathing exercises for relaxation"
    },
    {
      id: "color-connect",
      name: "Color Connect",
      difficulty: "Easy",
      mood: "🎯",
      image: "https://images.unsplash.com/photo-1595707678349-4b3f482bfbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXp6bGUlMjBnYW1lJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU4MDEwMTg2fDA&ixlib=rb-4-1.0&q=80&w=1080",
      description: "Connect matching colors to fill the board"
    },
  // (Your other games would go here)
];
export function FunzonePage({ onBack, onNavigate, onPlayGame }: FunzonePageProps) {
  const { selectedColor } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleBackNavigation = () => {
    if (currentPage === 1) {
      // If on page 1, go back to results
      onBack();
    } else {
      // If on page 2 or 3, go to page 1
      setCurrentPage(1);
    }
  };

  const gamesPerPage = 3;
  const totalPages = Math.ceil(allGames.length / gamesPerPage);
  
  const getCurrentGames = () => {
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    return allGames.slice(startIndex, endIndex);
  };

  const handlePlayGame = (gameId: string) => {
    // Here you would navigate to the specific game
    console.log("Playing game:", gameId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10B981"; // Green
      case "Medium":
        return "#F59E0B"; // Yellow
      case "Hard":
        return "#EF4444"; // Red
      default:
        return "#6B7280"; // Gray
    }
  };
return (
    <div className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}><span className="text-white text-sm">M</span></div>
          <span className="text-sm">Funzone</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="funzone" />
      </header>

      <main className="p-6 h-[calc(100vh-80px)] overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <div className="text-center mb-6 flex-shrink-0">
            <h1 className="text-2xl mb-2">FunZone</h1>
            <p className="text-gray-600">Choose a game to relax, focus, and boost your mood</p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {getCurrentGames().map((game) => (
              <div key={game.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col">
                <div className="relative h-40 overflow-hidden flex-shrink-0">
                  <ImageWithFallback src={game.image} alt={game.name} className="w-full h-full object-cover"/>
                  <div className="absolute top-3 left-3"><div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-lg">{game.mood}</div></div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg">{game.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{game.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 my-3">
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <span className="px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: getDifficultyColor(game.difficulty) }}>{game.difficulty}</span>
                  </div>
                  {/* --- FIX: Use the onPlayGame prop to launch the game --- */}
                  <Button onClick={() => onPlayGame(game.id)} className="w-full text-white py-2 rounded-xl hover:opacity-90 transition-opacity mt-auto" style={{ backgroundColor: selectedColor }}>
                    Play Game
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end flex-shrink-0">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button key={pageNum} onClick={() => setCurrentPage(pageNum)} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`w-10 h-10 rounded-full ${currentPage === pageNum ? "text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`} style={{ backgroundColor: currentPage === pageNum ? selectedColor : "transparent", borderColor: currentPage === pageNum ? selectedColor : "#d1d5db" }}>
                  {pageNum}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
//   return (
//     <div className="min-h-screen bg-white text-black">
//       {/* Header */}
//       <header className="flex items-center justify-between p-4">
//         <div className="flex items-center space-x-2">
//           <Button variant="ghost" size="sm" onClick={handleBackNavigation}>
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <div 
//             className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
//             style={{ backgroundColor: selectedColor }}
//           >
//             <span className="text-white text-sm">M</span>
//           </div>
//           <span className="text-sm">Funzone</span>
//         </div>
//         <SharedNavigation onNavigate={onNavigate} currentPage="funzone" />
//       </header>

//       {/* Main Content */}
//       <main className="p-6 h-[calc(100vh-80px)] overflow-hidden">
//         <div className="max-w-6xl mx-auto h-full flex flex-col">
//           {/* Page Title */}
//           <div className="text-center mb-6 flex-shrink-0">
//             <h1 className="text-2xl mb-2">FunZone</h1>
//             <p className="text-gray-600">Choose a game to relax, focus, and boost your mood</p>
//           </div>

//           {/* Games Grid */}
//           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             {getCurrentGames().map((game) => (
//               <div 
//                 key={game.id}
//                 className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
//               >
//                 {/* Game Image */}
//                 <div className="relative h-40 overflow-hidden flex-shrink-0">
//                   <ImageWithFallback
//                     src={game.image}
//                     alt={game.name}
//                     className="w-full h-full object-cover"
//                   />
//                   {/* Mood overlay */}
//                   <div className="absolute top-3 left-3">
//                     <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-lg">
//                       {game.mood}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Game Info */}
//                 <div className="p-4 flex flex-col flex-1">
//                   <div className="space-y-2 flex-1">
//                     <h3 className="text-lg">{game.name}</h3>
//                     <p className="text-sm text-gray-600 leading-relaxed">
//                       {game.description}
//                     </p>
//                   </div>

//                   {/* Difficulty Level */}
//                   <div className="flex items-center space-x-2 my-3">
//                     <span className="text-sm text-gray-600">Difficulty:</span>
//                     <span 
//                       className="px-2 py-1 rounded-full text-xs text-white"
//                       style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
//                     >
//                       {game.difficulty}
//                     </span>
//                   </div>

//                   {/* Play Button - Always at bottom */}
//                   <Button
//                     onClick={() => handlePlayGame(game.id)}
//                     className="w-full text-white py-2 rounded-xl hover:opacity-90 transition-opacity mt-auto"
//                     style={{ backgroundColor: selectedColor }}
//                   >
//                     Play Game
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-end flex-shrink-0">
//             <div className="flex space-x-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
//                 <Button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   variant={currentPage === pageNum ? "default" : "outline"}
//                   size="sm"
//                   className={`w-10 h-10 rounded-full ${
//                     currentPage === pageNum 
//                       ? "text-white" 
//                       : "border-gray-300 text-gray-600 hover:bg-gray-50"
//                   }`}
//                   style={{
//                     backgroundColor: currentPage === pageNum ? selectedColor : "transparent",
//                     borderColor: currentPage === pageNum ? selectedColor : "#d1d5db"
//                   }}
//                 >
//                   {pageNum}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }