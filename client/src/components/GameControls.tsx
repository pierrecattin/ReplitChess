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
        return gameState.winner === "w" ? "You Win!" : "AI Wins!";
      case "stalemate":
        return "Stalemate!";
      case "draw":
        return "Draw!";
      default:
        return gameState.turn === "w" ? "Your Turn" : "AI Thinking...";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={gameState.status === "playing" ? (gameState.turn === "w" ? "default" : "secondary") : "outline"}>
          {getStatusMessage()}
        </Badge>
        {gameState.inCheck && gameState.status === "playing" && (
          <Badge variant="destructive">Check!</Badge>
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