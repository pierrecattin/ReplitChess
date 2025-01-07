import { useRef, useState } from "react";
import type { Square } from "chess.js";

interface ChessPieceProps {
  piece: string;
  square: Square;
  onDrop: (from: Square, to: Square) => void;
  isPlayable: boolean;
}

export default function ChessPiece({ piece, square, onDrop, isPlayable }: ChessPieceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle mouse drag events
  const handleDragStart = (e: React.DragEvent) => {
    if (!isPlayable) {
      e.preventDefault();
      return;
    }

    setIsDragging(true);
    e.dataTransfer.setData("text/plain", square);
    e.dataTransfer.effectAllowed = "move";

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        ref.current,
        rect.width / 2,
        rect.height / 2
      );
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPlayable) return;

    const touch = e.touches[0];
    const element = ref.current;
    if (!element) return;

    setIsDragging(true);

    // Store the starting position
    element.dataset.touchStartX = touch.clientX.toString();
    element.dataset.touchStartY = touch.clientY.toString();
    element.dataset.startSquare = square;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (!isPlayable || !isDragging) return;

    const touch = e.touches[0];
    const element = ref.current;
    if (!element) return;

    // Calculate new position
    const startX = parseFloat(element.dataset.touchStartX || "0");
    const startY = parseFloat(element.dataset.touchStartY || "0");
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Apply transform to move the piece
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    element.style.zIndex = "50";
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isPlayable || !isDragging) return;

    const element = ref.current;
    if (!element) return;

    setIsDragging(false);
    element.style.transform = "";
    element.style.zIndex = "";

    // Find the square under the finger
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetSquare = target?.closest("[data-square]")?.getAttribute("data-square");

    if (targetSquare && targetSquare !== square) {
      onDrop(square, targetSquare as Square);
    }
  };

  const getPieceImage = (piece: string) => {
    const color = piece === piece.toUpperCase() ? "w" : "b";
    const type = piece.toLowerCase();
    return `/pieces/${color}${type}.svg`;
  };

  return (
    <div
      ref={ref}
      className={`absolute inset-0 cursor-${isPlayable ? 'grab' : 'default'} active:cursor-grabbing touch-none`}
      draggable={isPlayable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={getPieceImage(piece)}
        alt={`Chess piece ${piece}`}
        className={`w-full h-full p-1 ${isDragging ? 'opacity-50' : ''}`}
        draggable={false}
      />
    </div>
  );
}