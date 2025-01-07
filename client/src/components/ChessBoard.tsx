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
  const getFEN = useCallback((square: string) => {
    const pieces = position.split(' ')[0];
    const rows = pieces.split('/');
    const [file, rank] = square.split('');
    const fileIndex = files.indexOf(file);
    const rankIndex = ranks.indexOf(rank);

    let count = 0;
    for (let char of rows[rankIndex]) {
      if (isNaN(parseInt(char))) {
        if (count === fileIndex) {
          return char;
        }
        count++;
      } else {
        count += parseInt(char);
        if (count > fileIndex) break;
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
            const square = `${file}${rank}`;
            const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;
            const piece = getFEN(square);

            return (
              <div
                key={square}
                className={`relative ${
                  isLight ? 'bg-accent' : 'bg-muted'
                }`}
                data-square={square}
              >
                {piece && (
                  <ChessPiece
                    piece={piece}
                    square={square as Square}
                    onDrop={handleDrop}
                    isPlayable={gameState.status === "playing" && gameState.turn === "w" && piece === piece.toUpperCase()}
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