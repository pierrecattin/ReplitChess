import { useCallback } from "react";
import type { Square } from "chess.js";
import ChessPiece from "@/components/ChessPiece";
import type { GameState } from "@/lib/gameTypes";

interface ChessBoardProps {
  position: string;
  onMove: (from: string, to: string) => void;
  gameState: GameState;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

export default function ChessBoard({ position, onMove, gameState }: ChessBoardProps) {
  // Parse FEN string to get piece at a square
  const getPiece = useCallback((square: string): string | null => {
    const [file, rank] = square.split('');
    const fileIndex = files.indexOf(file);
    const rankIndex = ranks.indexOf(rank);

    const pieces = position.split(' ')[0];
    const rows = pieces.split('/');
    let col = 0;

    for (const char of rows[rankIndex]) {
      if (isNaN(Number(char))) {
        if (col === fileIndex) {
          return char;
        }
        col++;
      } else {
        col += Number(char);
        if (col > fileIndex) {
          return null;
        }
      }
    }
    return null;
  }, [position]);

  const handleDrop = useCallback((from: Square, to: Square) => {
    if (gameState.status === "playing" && gameState.turn === "w") {
      onMove(from, to);
    }
  }, [onMove, gameState]);

  return (
    <div className="aspect-square w-full max-w-[600px] mx-auto border-2 border-primary">
      <div className="grid grid-cols-8 h-full">
        {ranks.map((rank) => (
          files.map((file) => {
            const square = `${file}${rank}` as Square;
            const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;
            const piece = getPiece(square);

            return (
              <div
                key={square}
                className={`relative ${
                  isLight ? 'bg-white' : 'bg-gray-400'
                }`}
                data-square={square}
              >
                {piece && (
                  <ChessPiece
                    piece={piece}
                    square={square}
                    onDrop={handleDrop}
                    isPlayable={
                      gameState.status === "playing" &&
                      gameState.turn === "w" &&
                      piece === piece.toUpperCase()
                    }
                  />
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}