import { useRef } from "react";
import type { Square } from "chess.js";

interface ChessPieceProps {
  piece: string;
  square: Square;
  onDrop: (from: Square, to: Square) => void;
  isPlayable: boolean;
}

export default function ChessPiece({ piece, square, onDrop, isPlayable }: ChessPieceProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isPlayable) {
      e.preventDefault();
      return;
    }
    
    const element = e.target as HTMLElement;
    e.dataTransfer.setData("text/plain", square);
    e.dataTransfer.effectAllowed = "move";
    
    // Center the drag image
    if (element) {
      const rect = element.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        element,
        rect.width / 2,
        rect.height / 2
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromSquare = e.dataTransfer.getData("text/plain") as Square;
    onDrop(fromSquare, square);
  };

  const getPieceImage = (piece: string) => {
    const color = piece === piece.toUpperCase() ? "w" : "b";
    const pieceType = piece.toLowerCase();
    return `https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/${color}${pieceType}.svg`;
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      draggable={isPlayable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <img
        src={getPieceImage(piece)}
        alt={`Chess piece ${piece}`}
        className="w-full h-full p-1"
        draggable={false}
      />
    </div>
  );
}
