import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Award, RotateCw } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

interface ColorConnectGameProps {
  onBack: () => void;
}

const GRID_SIZE = 6;

interface Cell {
  id: string; // "row-col"
  isEndpoint: boolean;
  pairId: number | null;
  color: string | null;
}

const LEVEL_1 = [
  { pairId: 1, color: '#ee0a0a', start: { row: 0, col: 0 }, end: { row: 3, col: 3 } }, // Red
  { pairId: 2, color: '#1567eb', start: { row: 1, col: 1 }, end: { row: 4, col: 5 } }, // Blue
  { pairId: 3, color: '#0ef028', start: { row: 2, col: 0 }, end: { row: 5, col: 2 } }, // Green
  { pairId: 4, color: '#f36c0b', start: { row: 0, col: 5 }, end: { row: 4, col: 2 } }, // Orange
];

const createInitialGrid = (): Cell[][] => {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => ({
      id: `${row}-${col}`,
      isEndpoint: false,
      pairId: null,
      color: null,
    }))
  );

  LEVEL_1.forEach(({ pairId, color, start, end }) => {
    grid[start.row][start.col] = { ...grid[start.row][start.col], isEndpoint: true, pairId, color };
    grid[end.row][end.col] = { ...grid[end.row][end.col], isEndpoint: true, pairId, color };
  });

  return grid;
};

export function ColorConnectGame({ onBack }: ColorConnectGameProps) {
  const { selectedColor } = useTheme();
  const [grid, setGrid] = useState(createInitialGrid());
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [activePairId, setActivePairId] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);

  const resetLevel = useCallback(() => {
    setGrid(createInitialGrid());
    setCurrentPath([]);
    setActivePairId(null);
    setIsDrawing(false);
    setIsWon(false);
  }, []);
  
  const handleMouseDown = (cell: Cell) => {
    if (!cell.isEndpoint) return;
    
    setGrid(prevGrid => prevGrid.map(row => row.map(c => 
      c.pairId === cell.pairId && !c.isEndpoint ? { ...c, color: null, pairId: null } : c
    )));

    setIsDrawing(true);
    setActivePairId(cell.pairId);
    setCurrentPath([cell.id]);
  };
  
  const handleMouseEnter = (cell: Cell) => {
    if (!isDrawing || currentPath.includes(cell.id)) return;

    const lastCellId = currentPath[currentPath.length - 1];
    const [lastRow, lastCol] = lastCellId.split('-').map(Number);
    const [currRow, currCol] = cell.id.split('-').map(Number);
    
    const isAdjacent = Math.abs(lastRow - currRow) + Math.abs(lastCol - currCol) === 1;
    const canDraw = !cell.isEndpoint && !cell.color;

    if (isAdjacent && canDraw) {
      setCurrentPath(prev => [...prev, cell.id]);
    }
  };

  const handleMouseUp = (cell: Cell) => {
    if (!isDrawing) return;

    const startCellId = currentPath[0];
    
    if (cell.isEndpoint && cell.pairId === activePairId && cell.id !== startCellId) {
      // Successful connection, path will be kept
    } else {
      // Failed connection, clear the drawn path
      setGrid(prevGrid => prevGrid.map(row => row.map(c => 
        currentPath.includes(c.id) && !c.isEndpoint ? { ...c, color: null, pairId: null } : c
      )));
    }

    setIsDrawing(false);
    setActivePairId(null);
    setCurrentPath([]);
  };
  
  useEffect(() => {
    const activeEndpoint = LEVEL_1.find(p => p.pairId === activePairId);
    if (!activeEndpoint) return;

    setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        currentPath.forEach(cellId => {
            const [r, c] = cellId.split('-').map(Number);
            if (!newGrid[r][c].isEndpoint) {
                newGrid[r][c].color = activeEndpoint.color;
                newGrid[r][c].pairId = activeEndpoint.pairId;
            }
        });
        return newGrid;
    });

    if (!isDrawing && currentPath.length > 1) {
        const totalCells = GRID_SIZE * GRID_SIZE;
        const filledCells = grid.flat().filter(c => c.color !== null).length;
        if (filledCells === totalCells) {
            setIsWon(true);
        }
    }
  }, [currentPath, isDrawing, activePairId]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}><span className="text-white text-sm">M</span></div>
          <span className="text-sm">Color Connect</span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetLevel} className="flex items-center gap-2"><RotateCw size={16}/> Reset</Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="mb-4 text-gray-600">Connect the matching colored dots without crossing paths.</p>
        <div 
          className="p-2 rounded-lg touch-none"
          onMouseLeave={() => handleMouseUp({} as Cell)}
          style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'clamp(300px, 90vw, 500px)',
            aspectRatio: '1 / 1',
            backgroundColor: '#f3f4f6' // bg-gray-100
          }}
        >
          {grid.map((row) =>
            row.map((cell) => (
              <div
                key={cell.id}
                className="w-full h-full flex items-center justify-center"
                onMouseDown={() => handleMouseDown(cell)}
                onMouseEnter={() => handleMouseEnter(cell)}
                onMouseUp={() => handleMouseUp(cell)}
              >
                {/* --- THIS IS THE CHANGE --- */}
                {/* This inner div is what the user sees. We make it a circle. */}
                <div
                  className="w-full h-full flex items-center justify-center transition-colors duration-100"
                  style={{
                    borderRadius: '50%', // This makes the cell appear as a circle
                    backgroundColor: cell.color ? `${cell.color}40` : 'transparent',
                  }}
                >
                  {cell.isEndpoint && (
                    <div className="w-3/5 h-3/5 rounded-full shadow-inner" style={{ backgroundColor: cell.color! }} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Dialog open={isWon} onOpenChange={setIsWon}>
            <DialogContent className="sm:max-w-md text-center p-8">
                <DialogHeader>
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedColor + '20' }}><Award className="w-8 h-8" style={{ color: selectedColor }} /></div>
                    <DialogTitle className="text-2xl">Puzzle Complete!</DialogTitle>
                    <DialogDescription className="text-base text-gray-600">Well done! You've successfully connected all the dots.</DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <Button onClick={resetLevel} className="w-full text-white flex items-center gap-2" style={{ backgroundColor: selectedColor }}><RotateCw size={16} /> Play Again</Button>
                    <Button onClick={onBack} variant="outline" className="w-full">Back to Funzone</Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}