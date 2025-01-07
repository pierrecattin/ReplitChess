import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import type { GameState } from "@/lib/gameTypes";

interface GameControlsProps {
  gameState: GameState;
  onReset: () => void;
}

export default function GameControls({ gameState, onReset }: GameControlsProps) {
  const getStatusMessage = () => {
    switch (gameState.status) {
      case "checkmate":
        return gameState.winner === "w" ? "Checkmate - You Win!" : "Checkmate - AI Wins!";
      case "stalemate":
        return "Game Over - Stalemate!";
      case "draw":
        return "Game Over - Draw!";
      default:
        return gameState.turn === "w" ? "Your Turn" : "AI Thinking...";
    }
  };

  const getStatusVariant = () => {
    if (gameState.status === "playing") {
      return gameState.turn === "w" ? "default" : "secondary";
    }
    return gameState.status === "checkmate" 
      ? (gameState.winner === "w" ? "default" : "destructive")
      : "outline";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge 
          variant={getStatusVariant()}
          className="text-base px-4 py-1"
        >
          {getStatusMessage()}
        </Badge>
        {gameState.inCheck && gameState.status === "playing" && (
          <Badge variant="destructive" className="animate-pulse">
            Check!
          </Badge>
        )}
      </div>

      <Button
        variant="outline"
        onClick={onReset}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        New Game
      </Button>
    </div>
  );
}