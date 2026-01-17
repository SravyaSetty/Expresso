import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Award, RotateCw } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

interface MemoryFlipGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ["😊", "🚀", "🌟", "🎉", "❤️", "💡", "🤔", "✅"];

const generateCards = (): Card[] => {
  const cards: Card[] = [];
  EMOJIS.forEach((emoji, index) => {
    cards.push({ id: index * 2, emoji, isFlipped: false, isMatched: false });
    cards.push({ id: index * 2 + 1, emoji, isFlipped: false, isMatched: false });
  });
  // Fisher-Yates shuffle algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

export function MemoryFlipGame({ onBack }: MemoryFlipGameProps) {
  const { selectedColor } = useTheme();
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards.find(c => c.id === firstIndex);
      const secondCard = cards.find(c => c.id === secondIndex);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              flippedCards.includes(card.id) ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);
  
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsWon(true);
    }
  }, [cards]);


  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(card => card.id === id);
    if (isChecking || !clickedCard || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    if (flippedCards.length === 0) {
      setFlippedCards([id]);
    } else if (flippedCards.length === 1) {
      setFlippedCards([flippedCards[0], id]);
      setMoves(moves + 1);
    }
  };

  const handlePlayAgain = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}>
            <span className="text-white text-sm">M</span>
          </div>
          <span className="text-sm">Memory Flip</span>
        </div>
        <div className="text-sm">Moves: <span className="font-bold">{moves}</span></div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '24rem',
            width: '100%'
          }}
        >
          {cards.map(card => (
            <div
              key={card.id}
              className="aspect-square cursor-pointer"
              // --- THIS IS THE FIX ---
              // Add perspective style to the container of the flipping card
              style={{ perspective: '1000px' }}
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className="w-full h-full relative transition-transform duration-500"
                // Add transform-style and the actual rotation based on state
                style={{
                    transformStyle: 'preserve-3d',
                    transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Card Back */}
                <div 
                  className="absolute w-full h-full rounded-lg flex items-center justify-center"
                  // Add backface-visibility style
                  style={{ 
                    backfaceVisibility: 'hidden',
                    backgroundColor: selectedColor,
                  }}
                >
                     <span className="text-2xl sm:text-3xl text-white">?</span>
                </div>
                {/* Card Front */}
                <div 
                  className="absolute w-full h-full rounded-lg bg-gray-200 flex items-center justify-center"
                  // Add backface-visibility and the initial rotation
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <span className="text-3xl sm:text-5xl">{card.emoji}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

       <Dialog open={isWon} onOpenChange={setIsWon}>
            <DialogContent className="sm:max-w-md text-center p-8">
                <DialogHeader>
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedColor + '20' }}>
                        <Award className="w-8 h-8" style={{ color: selectedColor }} />
                    </div>
                    <DialogTitle className="text-2xl">Congratulations!</DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                        You've matched all the pairs in {moves} moves.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <Button onClick={handlePlayAgain} className="w-full text-white flex items-center gap-2" style={{ backgroundColor: selectedColor }}>
                        <RotateCw size={16} /> Play Again
                    </Button>
                    <Button onClick={onBack} variant="outline" className="w-full">
                        Back to Funzone
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}